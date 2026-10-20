// MESCE FM 108.1 Live Studio Microphone & Voice Broadcast Service
// Real-time audio streaming from RJ Studio Desk (/admin) to all Student Listeners
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { audioEngine } from './audioEngine'

class LiveBroadcastService {
  constructor() {
    this.isBroadcasting = false
    this.mediaStream = null
    this.audioContext = null
    this.analyser = null
    this.mediaRecorder = null
    this.broadcastChannel = null
    this.levelCallback = null
    this.stateCallback = null
    this.animFrameId = null
    this.duckMusic = true
    this.activeSpeaker = 'RJ On-Air'
    this.chunkSequence = 0

    // Listener audio element for playing RJ speech on student devices
    this.listenerAudio = null
    this.listenerAudioQueue = []
    this.isProcessingQueue = false
    this.firestoreUnsub = null

    this.initBroadcastChannel()
    this.initListenerAudio()
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

  initListenerAudio() {
    if (typeof window !== 'undefined') {
      this.listenerAudio = new Audio()
      this.listenerAudio.autoplay = true
      this.listenerAudio.volume = 1.0
      this.listenerAudio.onended = () => {
        this.playNextInQueue()
      }
    }
  }

  /**
   * Starts listening to live RJ broadcasts (called by student app)
   */
  startListening(onBroadcastStateChange) {
    this.stateCallback = onBroadcastStateChange

    // 1. Listen to Firestore radio_state/live for mic status
    try {
      const docRef = doc(db, 'radio_state', 'live')
      this.firestoreUnsub = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          const liveMic = data.liveMic || { isActive: false }
          this.handleMicStateUpdate(liveMic)

          // If there is an active base64 voice chunk from Firestore
          if (liveMic.isActive && liveMic.audioChunk && liveMic.chunkSeq > this.chunkSequence) {
            this.chunkSequence = liveMic.chunkSeq
            this.queueAudioBase64(liveMic.audioChunk, liveMic.mimeType || 'audio/webm')
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

    if (data.type === 'MIC_STATE') {
      this.handleMicStateUpdate(data.liveMic)
    } else if (data.type === 'AUDIO_CHUNK') {
      if (data.blob) {
        this.queueAudioBlob(data.blob)
      } else if (data.base64) {
        this.queueAudioBase64(data.base64, data.mimeType || 'audio/webm')
      }
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
    } else {
      // Restore background music volume
      audioEngine.duckAudio(false)
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

  queueAudioBlob(blob) {
    const url = URL.createObjectURL(blob)
    this.listenerAudioQueue.push(url)
    if (!this.isProcessingQueue) {
      this.playNextInQueue()
    }
  }

  queueAudioBase64(base64Data, mimeType = 'audio/webm') {
    try {
      const byteChars = atob(base64Data)
      const byteNumbers = new Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      this.queueAudioBlob(blob)
    } catch (e) {
      console.warn('Error queuing base64 audio:', e)
    }
  }

  playNextInQueue() {
    if (this.listenerAudioQueue.length === 0) {
      this.isProcessingQueue = false
      return
    }

    this.isProcessingQueue = true
    const nextUrl = this.listenerAudioQueue.shift()
    if (this.listenerAudio) {
      this.listenerAudio.src = nextUrl
      const playPromise = this.listenerAudio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Live voice playback error:', err)
          this.playNextInQueue()
        })
      }
    }
  }

  /**
   * RJ STUDIO ACTIONS: Starts live microphone broadcast
   */
  async startBroadcasting({ rjName = 'RJ Farhan', showTitle = 'Live Campus Talk', duck = true }) {
    if (this.isBroadcasting) return true

    this.activeSpeaker = rjName
    this.duckMusic = duck

    try {
      // 1. Request microphone access with high quality audio processing
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      })
      this.mediaStream = stream

      // 2. Set up Web Audio API Analyser for real-time VU meter
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContextClass()
      const source = this.audioContext.createMediaStreamSource(stream)
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 64
      source.connect(this.analyser)

      // Start level monitoring loop
      this.startLevelMeter()

      // 3. Configure MediaRecorder for live voice slicing
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4'
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm'
        } else {
          mimeType = ''
        }
      }

      this.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0 && this.isBroadcasting) {
          this.chunkSequence++
          const blob = event.data

          // A. Send immediately via BroadcastChannel to other tabs/windows
          if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
              type: 'AUDIO_CHUNK',
              blob,
              mimeType: this.mediaRecorder.mimeType,
              seq: this.chunkSequence,
            })
          }

          // B. Convert chunk to Base64 for Firestore streaming
          try {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = async () => {
              const base64String = reader.result?.toString().split(',')[1]
              if (base64String) {
                const docRef = doc(db, 'radio_state', 'live')
                await updateDoc(docRef, {
                  'liveMic.audioChunk': base64String,
                  'liveMic.chunkSeq': this.chunkSequence,
                  'liveMic.mimeType': this.mediaRecorder?.mimeType || 'audio/webm',
                }).catch(() => {})
              }
            }
          } catch (e) {
            console.warn('Error pushing chunk to Firestore:', e)
          }
        }
      }

      // Slices audio every 800ms for continuous streaming
      this.mediaRecorder.start(800)
      this.isBroadcasting = true

      // 4. Update Firestore & BroadcastChannel that Live Mic is ON
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

    // Stop audio meter
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }

    // Stop recorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch (e) {
        console.warn(e)
      }
    }

    // Stop all media tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    // Close AudioContext
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close()
      } catch (e) {
        console.warn(e)
      }
      this.audioContext = null
    }

    // Reset level meter
    if (this.levelCallback) {
      this.levelCallback(0)
    }

    // Update Firestore & BroadcastChannel that Live Mic is OFF
    const liveMicPayload = {
      isActive: false,
      rj: null,
      show: null,
      audioChunk: null,
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

      // Compute average volume level
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
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()

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
