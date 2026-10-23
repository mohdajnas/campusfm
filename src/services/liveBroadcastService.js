// MESCE FM 108.1 Live Studio Microphone & Voice Broadcast Service
// Robust Real-Time PCM & WAV Streaming Engine from RJ Studio Desk (/admin) to Student Listeners
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { audioEngine } from './audioEngine'

// Utility: Downsamples Float32 audio from input sample rate (e.g. 48000) to target rate (16000)
function downsampleBuffer(buffer, inputSampleRate, outputSampleRate = 16000) {
  if (inputSampleRate === outputSampleRate || inputSampleRate < outputSampleRate) {
    return buffer
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate
  const newLength = Math.round(buffer.length / sampleRateRatio)
  const result = new Float32Array(newLength)
  let offsetResult = 0
  let offsetBuffer = 0
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
    let accum = 0
    let count = 0
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i]
      count++
    }
    result[offsetResult] = count > 0 ? accum / count : buffer[offsetBuffer]
    offsetResult++
    offsetBuffer = nextOffsetBuffer
  }
  return result
}

// Utility: Converts Float32Array (-1.0 to +1.0) to 16-bit PCM Int16Array
function floatToInt16(floatSamples) {
  const int16 = new Int16Array(floatSamples.length)
  for (let i = 0; i < floatSamples.length; i++) {
    const s = Math.max(-1, Math.min(1, floatSamples[i]))
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return int16
}

// Utility: Converts 16-bit PCM Int16Array back to Float32Array
function int16ToFloat(int16Samples) {
  const float32 = new Float32Array(int16Samples.length)
  for (let i = 0; i < int16Samples.length; i++) {
    float32[i] = int16Samples[i] / (int16Samples[i] < 0 ? 0x8000 : 0x7fff)
  }
  return float32
}

// Utility: Encodes 16-bit PCM samples into standard 44-byte RIFF WAV ArrayBuffer
function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  // 'RIFF' chunk descriptor
  view.setUint8(0, 0x52)
  view.setUint8(1, 0x49)
  view.setUint8(2, 0x46)
  view.setUint8(3, 0x46)
  view.setUint32(4, 36 + samples.length * 2, true)
  view.setUint8(8, 0x57)
  view.setUint8(9, 0x41)
  view.setUint8(10, 0x56)
  view.setUint8(11, 0x45)

  // 'fmt ' sub-chunk
  view.setUint8(12, 0x66)
  view.setUint8(13, 0x6d)
  view.setUint8(14, 0x74)
  view.setUint8(15, 0x20)
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM = 1
  view.setUint16(22, 1, true) // Mono = 1
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)

  // 'data' sub-chunk
  view.setUint8(36, 0x64)
  view.setUint8(37, 0x61)
  view.setUint8(38, 0x74)
  view.setUint8(39, 0x61)
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(offset, samples[i], true)
    offset += 2
  }

  return buffer
}

class LiveBroadcastService {
  constructor() {
    this.isBroadcasting = false
    this.mediaStream = null
    this.broadcasterCtx = null
    this.analyser = null
    this.scriptProcessor = null
    this.silentGain = null
    this.broadcastChannel = null
    this.levelCallback = null
    this.stateCallback = null
    this.animFrameId = null

    this.activeSpeaker = 'RJ On-Air'
    this.duckMusic = true
    this.chunkSequence = 0

    // Buffers for broadcaster
    this.pcmLocalBuffer = []
    this.pcmFirestoreBuffer = []
    this.lastFirestoreWriteTime = 0

    // Listener (Student side) Web Audio API Pipeline
    this.listenerCtx = null
    this.listenerGainNode = null
    this.nextVoicePlayTime = 0
    this.lastBroadcastChannelChunkTime = 0
    this.lastPlayedFirestoreSeq = 0
    this.firestoreUnsub = null

    this.initBroadcastChannel()
    this.setupGlobalAudioUnlock()
  }

  initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('mesce_fm_live_voice')
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingBroadcastMessage(event.data)
        }
      } catch (e) {
        console.warn('BroadcastChannel init note:', e)
      }
    }
  }

  setupGlobalAudioUnlock() {
    if (typeof window === 'undefined') return
    const unlock = () => {
      this.unlockAudio()
    }
    window.addEventListener('click', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
  }

  ensureListenerContext() {
    if (typeof window === 'undefined') return null

    if (!this.listenerCtx || this.listenerCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return null
      this.listenerCtx = new AudioCtx()
      this.listenerGainNode = this.listenerCtx.createGain()
      this.listenerGainNode.gain.value = 1.4 // Loud and clear RJ speech
      this.listenerGainNode.connect(this.listenerCtx.destination)
    }

    if (this.listenerCtx.state === 'suspended') {
      this.listenerCtx.resume().catch(() => {})
    }

    return this.listenerCtx
  }

  unlockAudio() {
    const ctx = this.ensureListenerContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }

  /**
   * Starts listening to live RJ broadcasts (called on student app load)
   */
  startListening(onBroadcastStateChange) {
    this.stateCallback = onBroadcastStateChange
    this.ensureListenerContext()

    // 1. Subscribe to Firestore radio_state/live for live mic status and cross-device audio
    try {
      const docRef = doc(db, 'radio_state', 'live')
      this.firestoreUnsub = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          const liveMic = data.liveMic || { isActive: false }
          this.handleMicStateUpdate(liveMic)

          // If there is an active Base64 WAV chunk from Firestore for cross-device listeners
          if (liveMic.isActive && liveMic.audioWav && liveMic.chunkSeq > this.lastPlayedFirestoreSeq) {
            this.lastPlayedFirestoreSeq = liveMic.chunkSeq
            // Only play from Firestore if no recent local BroadcastChannel chunks arrived
            const now = Date.now()
            if (now - this.lastBroadcastChannelChunkTime > 2000) {
              this.playWavBase64(liveMic.audioWav)
            }
          }
        }
      })
    } catch (e) {
      console.warn('Firestore live mic listener error:', e)
    }

    return () => {
      if (this.firestoreUnsub) this.firestoreUnsub()
    }
  }

  handleIncomingBroadcastMessage(data) {
    if (!data) return

    // If THIS tab is currently broadcasting the microphone, don't play it back (prevents feedback loop)
    if (this.isBroadcasting) return

    if (data.type === 'MIC_STATE') {
      this.handleMicStateUpdate(data.liveMic)
    } else if (data.type === 'PCM_VOICE_CHUNK') {
      this.lastBroadcastChannelChunkTime = Date.now()
      this.playPcmChunk(data.pcmData, data.sampleRate || 16000)
    } else if (data.type === 'SOUND_EFFECT') {
      this.playLocalSoundEffect(data.effectName)
    }
  }

  handleMicStateUpdate(liveMic) {
    const isLive = Boolean(liveMic && liveMic.isActive)
    const speaker = liveMic?.rj || 'RJ On-Air'
    const show = liveMic?.show || 'Live Campus Broadcast'

    if (isLive) {
      // Duck background music so RJ voice is clear and prominent!
      audioEngine.duckAudio(true, 0.12)
      this.ensureListenerContext()
    } else {
      // Restore background music volume
      audioEngine.duckAudio(false)
      this.nextVoicePlayTime = 0
    }

    if (this.stateCallback) {
      this.stateCallback({
        isLive,
        speaker,
        show,
        startedAt: liveMic?.startedAt || null,
      })
    }
  }

  /**
   * Plays a live PCM voice chunk smoothly via Web Audio API AudioBufferSourceNode
   */
  playPcmChunk(int16Samples, sampleRate = 16000) {
    if (!int16Samples || int16Samples.length === 0) return

    const ctx = this.ensureListenerContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    // Convert Int16 to Float32
    const floatSamples = int16ToFloat(int16Samples)

    // Create an AudioBuffer
    const audioBuffer = ctx.createBuffer(1, floatSamples.length, sampleRate)
    audioBuffer.getChannelData(0).set(floatSamples)

    // Create AudioBufferSourceNode
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.listenerGainNode || ctx.destination)

    // Schedule seamlessly on the timeline with a 35ms jitter safety buffer
    const currentTime = ctx.currentTime
    if (this.nextVoicePlayTime < currentTime) {
      this.nextVoicePlayTime = currentTime + 0.035
    }

    source.start(this.nextVoicePlayTime)
    this.nextVoicePlayTime += audioBuffer.duration
  }

  /**
   * Decodes Base64 WAV audio from Firestore for cross-device listeners
   */
  playWavBase64(base64Wav) {
    try {
      const binaryString = atob(base64Wav)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // If WAV header is at least 44 bytes, extract the 16-bit PCM
      if (bytes.length > 44) {
        const pcmLength = (bytes.length - 44) / 2
        const view = new DataView(bytes.buffer)
        const int16Samples = new Int16Array(pcmLength)
        for (let i = 0; i < pcmLength; i++) {
          int16Samples[i] = view.getInt16(44 + i * 2, true)
        }
        this.playPcmChunk(int16Samples, 16000)
      }
    } catch (e) {
      console.warn('Error decoding WAV base64 from Firestore:', e)
    }
  }

  /**
   * RJ STUDIO ACTIONS: Starts live microphone broadcast
   */
  async startBroadcasting({ rjName = 'RJ Farhan', showTitle = 'Live Campus Talk', duck = true }) {
    if (this.isBroadcasting) return true

    this.activeSpeaker = rjName
    this.duckMusic = duck
    this.pcmLocalBuffer = []
    this.pcmFirestoreBuffer = []
    this.chunkSequence = 0

    try {
      // 1. Request microphone access with echo cancellation & noise suppression
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      this.mediaStream = stream

      // 2. Set up Web Audio API on broadcaster
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      this.broadcasterCtx = new AudioContextClass()

      const micSource = this.broadcasterCtx.createMediaStreamSource(stream)

      // 3. Analyser for VU Meter
      this.analyser = this.broadcasterCtx.createAnalyser()
      this.analyser.fftSize = 64
      micSource.connect(this.analyser)

      // 4. ScriptProcessorNode to capture raw PCM audio
      // Buffer size 4096 at 48kHz = ~85ms chunks
      const bufferSize = 4096
      this.scriptProcessor = this.broadcasterCtx.createScriptProcessor(bufferSize, 1, 1)

      const inputSampleRate = this.broadcasterCtx.sampleRate || 48000
      const targetSampleRate = 16000

      this.scriptProcessor.onaudioprocess = (e) => {
        if (!this.isBroadcasting) return

        const inputChannelData = e.inputBuffer.getChannelData(0)
        // Downsample to 16,000 Hz for voice clarity and low bandwidth
        const downsampled = downsampleBuffer(inputChannelData, inputSampleRate, targetSampleRate)
        const int16Samples = floatToInt16(downsampled)

        // Accumulate for local BroadcastChannel streaming (~250ms = 4000 samples)
        for (let i = 0; i < int16Samples.length; i++) {
          this.pcmLocalBuffer.push(int16Samples[i])
          this.pcmFirestoreBuffer.push(int16Samples[i])
        }

        // Send local chunk every ~250ms (4000 samples)
        if (this.pcmLocalBuffer.length >= 4000) {
          const chunkToSend = new Int16Array(this.pcmLocalBuffer)
          this.pcmLocalBuffer = []
          this.chunkSequence++

          if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
              type: 'PCM_VOICE_CHUNK',
              pcmData: chunkToSend,
              sampleRate: targetSampleRate,
              seq: this.chunkSequence,
            })
          }
        }

        // Send Firestore chunk every ~1.2s (19200 samples) for cross-device listeners
        const now = Date.now()
        if (this.pcmFirestoreBuffer.length >= 19200 && now - this.lastFirestoreWriteTime > 1200) {
          const firestoreChunk = new Int16Array(this.pcmFirestoreBuffer)
          this.pcmFirestoreBuffer = []
          this.lastFirestoreWriteTime = now

          const wavBuffer = encodeWAV(firestoreChunk, targetSampleRate)
          const uint8 = new Uint8Array(wavBuffer)
          let binary = ''
          for (let i = 0; i < uint8.length; i++) {
            binary += String.fromCharCode(uint8[i])
          }
          const base64Wav = btoa(binary)

          const docRef = doc(db, 'radio_state', 'live')
          updateDoc(docRef, {
            'liveMic.audioWav': base64Wav,
            'liveMic.chunkSeq': this.chunkSequence,
            'liveMic.timestamp': now,
          }).catch(() => {})
        }
      }

      // Connect mic to scriptProcessor, and processor to silent gain (avoids self-echo)
      this.silentGain = this.broadcasterCtx.createGain()
      this.silentGain.gain.value = 0 // MUTE to RJ's own speakers to prevent screech
      micSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.silentGain)
      this.silentGain.connect(this.broadcasterCtx.destination)

      // Start VU Meter loop
      this.startLevelMeter()
      this.isBroadcasting = true

      // 5. Update Firestore & BroadcastChannel that Live Mic is ON
      const liveMicPayload = {
        isActive: true,
        rj: rjName,
        show: showTitle,
        duckMusic: duck,
        startedAt: Date.now(),
      }

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'MIC_STATE',
          liveMic: liveMicPayload,
        })
      }

      const docRef = doc(db, 'radio_state', 'live')
      await setDoc(docRef, { liveMic: liveMicPayload }, { merge: true })

      return true
    } catch (err) {
      console.error('Error starting live microphone broadcast:', err)
      throw err
    }
  }

  /**
   * RJ STUDIO ACTIONS: Stops live microphone broadcast
   */
  async stopBroadcasting() {
    if (!this.isBroadcasting) return

    this.isBroadcasting = false

    // Flush any remaining local buffer
    if (this.pcmLocalBuffer.length > 0 && this.broadcastChannel) {
      const remaining = new Int16Array(this.pcmLocalBuffer)
      this.pcmLocalBuffer = []
      this.broadcastChannel.postMessage({
        type: 'PCM_VOICE_CHUNK',
        pcmData: remaining,
        sampleRate: 16000,
        seq: ++this.chunkSequence,
      })
    }

    // Stop level meter
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }

    // Disconnect scriptProcessor
    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect()
      } catch (e) {
        console.warn(e)
      }
      this.scriptProcessor = null
    }

    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    // Close broadcaster AudioContext
    if (this.broadcasterCtx && this.broadcasterCtx.state !== 'closed') {
      try {
        this.broadcasterCtx.close()
      } catch (e) {
        console.warn(e)
      }
      this.broadcasterCtx = null
    }

    // Reset level meter callback
    if (this.levelCallback) {
      this.levelCallback(0)
    }

    // Update Firestore & BroadcastChannel that Live Mic is OFF
    const liveMicPayload = {
      isActive: false,
      rj: null,
      show: null,
      audioWav: null,
      stoppedAt: Date.now(),
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'MIC_STATE',
        liveMic: liveMicPayload,
      })
    }

    try {
      const docRef = doc(db, 'radio_state', 'live')
      await setDoc(docRef, { liveMic: liveMicPayload }, { merge: true })
    } catch (e) {
      console.warn('Error clearing live mic state:', e)
    }
  }

  startLevelMeter() {
    if (!this.analyser) return

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    const update = () => {
      if (!this.isBroadcasting || !this.analyser) return
      this.analyser.getByteFrequencyData(dataArray)

      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const avg = sum / dataArray.length
      const percent = Math.min(100, Math.round((avg / 128) * 100))

      if (this.levelCallback) {
        this.levelCallback(percent)
      }

      this.animFrameId = requestAnimationFrame(update)
    }

    update()
  }

  onMicLevel(callback) {
    this.levelCallback = callback
  }

  /**
   * Soundboard Jingles & SFX (Plays on RJ console AND broadcasts to students)
   */
  triggerSoundEffect(effectName) {
    this.playLocalSoundEffect(effectName)

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'SOUND_EFFECT',
        effectName,
      })
    }
  }

  playLocalSoundEffect(effectName) {
    try {
      const ctx = this.ensureListenerContext() || this.broadcasterCtx
      if (!ctx) return

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      if (effectName === 'jingle') {
        // High-energy FM Station Chime (E - G# - B - E5)
        const notes = [329.63, 415.3, 493.88, 659.25]
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)
          gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12)
          gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + idx * 0.12 + 0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.45)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(ctx.currentTime + idx * 0.12)
          osc.stop(ctx.currentTime + idx * 0.12 + 0.5)
        })
      } else if (effectName === 'airhorn') {
        // Classic Reggae / Dancehall DJ Airhorn
        const tones = [587.33, 587.33, 587.33, 440]
        tones.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11)
          gain.gain.setValueAtTime(0.35, ctx.currentTime + idx * 0.11)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.11 + 0.15)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(ctx.currentTime + idx * 0.11)
          osc.stop(ctx.currentTime + idx * 0.11 + 0.16)
        })
      } else if (effectName === 'applause') {
        // Synthesized crowd ovation sweep
        const bufferSize = ctx.sampleRate * 1.5
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(1000, ctx.currentTime)
        filter.Q.setValueAtTime(2, ctx.currentTime)

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.01, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)

        noise.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        noise.start(ctx.currentTime)
        noise.stop(ctx.currentTime + 1.5)
      }
    } catch (e) {
      console.warn('Sound effect synth error:', e)
    }
  }
}

export const liveBroadcastService = new LiveBroadcastService()
