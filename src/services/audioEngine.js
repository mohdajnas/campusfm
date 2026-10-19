// Audio Engine: Web Audio API & HTML5 Live Stream Player

class AudioEngine {
  constructor() {
    this.audio = new Audio()
    this.audio.preload = 'none'
    this.audio.crossOrigin = 'anonymous'

    this.audioCtx = null
    this.synthOsc = null
    this.synthGain = null
    this.staticNoiseNode = null
    this.analyser = null
    this.isSynthPlaying = false
    this.currentStationId = null
    this.isPlaying = false
    this.volume = 0.8
    this.listeners = new Set()

    this.audio.volume = this.volume

    this.audio.addEventListener('playing', () => {
      this.isPlaying = true
      this.notify()
    })

    this.audio.addEventListener('pause', () => {
      if (!this.isSynthPlaying) {
        this.isPlaying = false
        this.notify()
      }
    })

    this.audio.addEventListener('error', (err) => {
      console.warn('Live stream encountered network/CORS issue, engaging radio synthesizer fallback.', err)
      this.startRadioSynth()
    })
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener({
          isPlaying: this.isPlaying,
          volume: this.volume,
          isSynth: this.isSynthPlaying,
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    this.audio.volume = this.volume
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime)
    }
    this.notify()
  }

  playStation(station) {
    this.initContext()
    this.currentStationId = station.id

    // Play quick authentic frequency tuner chirp
    this.playTuningChirp(station.freqNum)

    this.stopSynth()
    this.audio.pause()

    if (station.streamUrl) {
      this.audio.src = station.streamUrl
      const playPromise = this.audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true
            this.isSynthPlaying = false
            this.notify()
          })
          .catch((e) => {
            console.log('Stream auto-play blocked or stream offline. Falling back to synth engine.', e)
            this.startRadioSynth(station)
          })
      }
    } else {
      this.startRadioSynth(station)
    }
  }

  togglePlay(station) {
    if (this.isPlaying) {
      this.pause()
    } else {
      if (station) {
        this.playStation(station)
      } else {
        this.audio.play().catch(() => this.startRadioSynth())
      }
    }
  }

  pause() {
    this.audio.pause()
    this.stopSynth()
    this.isPlaying = false
    this.notify()
  }

  playTuningChirp(freq = 100.0) {
    if (!this.audioCtx) return
    try {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const now = this.audioCtx.currentTime

      // Frequency glide based on MHz
      const baseFreq = 300 + (freq - 87.5) * 20
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08)

      gain.gain.setValueAtTime(this.volume * 0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    } catch {
      // Ignore audio glitch on old devices
    }
  }

  // Realistic synthetic FM radio sound engine
  startRadioSynth(station) {
    this.initContext()
    if (!this.audioCtx) return
    this.stopSynth()

    try {
      const now = this.audioCtx.currentTime
      const master = this.audioCtx.createGain()
      master.gain.setValueAtTime(this.volume * 0.12, now)
      master.connect(this.audioCtx.destination)

      // Chords based on station frequency
      const fNum = station?.freqNum || 102.7
      const root = 140 + (fNum % 12) * 15

      const chordFrequencies = [root, root * 1.25, root * 1.5, root * 2]
      this.synthOscs = []

      chordFrequencies.forEach((f, idx) => {
        const osc = this.audioCtx.createOscillator()
        const g = this.audioCtx.createGain()
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(f, now)

        // subtle vibrato
        const lfo = this.audioCtx.createOscillator()
        const lfoGain = this.audioCtx.createGain()
        lfo.frequency.setValueAtTime(2 + idx * 0.5, now)
        lfoGain.gain.setValueAtTime(2, now)
        lfo.connect(osc.frequency)
        lfo.start(now)

        g.gain.setValueAtTime(0.08 / (idx + 1), now)
        osc.connect(g)
        g.connect(master)
        osc.start(now)
        this.synthOscs.push(osc, lfo)
      })

      this.synthGain = master
      this.isSynthPlaying = true
      this.isPlaying = true
      this.notify()
    } catch (e) {
      console.warn('Radio synthesizer initialization note:', e)
    }
  }

  stopSynth() {
    if (this.synthOscs) {
      this.synthOscs.forEach((o) => {
        try {
          o.stop()
          o.disconnect()
        } catch {
          // Ignore
        }
      })
      this.synthOscs = []
    }
    if (this.synthGain) {
      try {
        this.synthGain.disconnect()
      } catch {
        // Ignore
      }
      this.synthGain = null
    }
    this.isSynthPlaying = false
  }
}

export const audioEngine = new AudioEngine()
