// Audio Engine: Real Music Stream & On-Air Dynamic Queue Player for MESCE FM 108.1
import { DEFAULT_MALAYALAM_PLAYLIST } from './musicService'

class AudioEngine {
  constructor() {
    this.audio = new Audio()
    this.audio.preload = 'auto'
    this.audio.crossOrigin = 'anonymous'

    this.audioCtx = null
    this.isPlaying = false
    this.volume = 0.8
    this.audio.volume = this.volume

    // Playback state
    this.currentTrack = DEFAULT_MALAYALAM_PLAYLIST[0]
    this.queue = [] // Array of tracks waiting to play next (e.g. user dedications)
    this.history = [] // Array of played tracks
    this.defaultPlaylist = DEFAULT_MALAYALAM_PLAYLIST
    this.playlistIndex = 0

    this.currentTime = 0
    this.duration = 30
    this.listeners = new Set()

    // Setup HTML5 Audio Event Listeners
    this.audio.addEventListener('playing', () => {
      this.isPlaying = true
      this.notify()
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.notify()
    })

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration
      }
      this.notify()
    })

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration
      }
      this.notify()
    })

    // AUTO-ADVANCE: When track ends, play the next track in queue (e.g. requested song)
    this.audio.addEventListener('ended', () => {
      console.log('MESCE FM: Track completed. Auto-advancing to next queued track...')
      this.advanceNext()
    })

    this.audio.addEventListener('error', (err) => {
      console.warn('Audio stream error or network block, skipping to next track:', err)
      setTimeout(() => {
        if (this.isPlaying) {
          this.advanceNext()
        }
      }, 1000)
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
    // Send immediate initial state
    try {
      listener(this.getState())
    } catch (e) {
      console.error(e)
    }
    return () => this.listeners.delete(listener)
  }

  notify() {
    const state = this.getState()
    for (const listener of this.listeners) {
      try {
        listener(state)
      } catch (e) {
        console.error(e)
      }
    }
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTrack: this.currentTrack,
      queue: [...this.queue],
      history: [...this.history],
      currentTime: this.currentTime,
      duration: this.duration || 30,
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    this.audio.volume = this.volume
    this.notify()
  }

  seek(seconds) {
    if (!isNaN(seconds) && this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.duration || 1000))
      this.currentTime = this.audio.currentTime
      this.notify()
    }
  }

  /**
   * Starts playing a specific track immediately
   */
  playTrack(track) {
    this.initContext()
    if (!track || !track.streamUrl) return

    // If there is an active current track, save to history
    if (this.currentTrack && this.currentTrack.id !== track.id) {
      this.history.unshift(this.currentTrack)
      if (this.history.length > 20) this.history.pop()
    }

    this.currentTrack = track
    this.currentTime = 0
    this.duration = track.duration || 30
    this.audio.src = track.streamUrl

    const playPromise = this.audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true
          this.notify()
        })
        .catch((e) => {
          console.warn('Audio auto-play blocked by browser policy:', e)
          this.isPlaying = false
          this.notify()
        })
    }
  }

  /**
   * Toggles playback between play and pause.
   */
  togglePlay(overrideTrack) {
    this.initContext()
    if (this.isPlaying) {
      this.pause()
    } else {
      if (overrideTrack) {
        this.playTrack(overrideTrack)
      } else if (this.audio.src) {
        this.audio.play().catch(() => {
          if (this.currentTrack) this.playTrack(this.currentTrack)
        })
      } else {
        const trackToPlay = this.currentTrack || this.defaultPlaylist[0]
        this.playTrack(trackToPlay)
      }
    }
  }

  pause() {
    this.audio.pause()
    this.isPlaying = false
    this.notify()
  }

  /**
   * Adds a track to the playback queue.
   * If playNext is true (standard for song requests / dedications),
   * inserts it at position 0 so it plays right after the current song!
   */
  addToQueue(track, playNext = true) {
    if (!track) return

    if (playNext) {
      this.queue.unshift(track) // Plays right after current track!
    } else {
      this.queue.push(track)
    }

    // If nothing is currently playing, start playing it immediately
    if (!this.isPlaying && (!this.audio.src || this.audio.paused)) {
      const next = this.queue.shift()
      this.playTrack(next)
      return
    }

    this.notify()
  }

  /**
   * Removes a track from the queue at a given index
   */
  removeFromQueue(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1)
      this.notify()
    }
  }

  /**
   * Advances to the next track:
   * 1. If queue has items (e.g. requested songs), plays the first one.
   * 2. If queue is empty, plays the next song from the default campus rotation.
   */
  advanceNext() {
    if (this.queue.length > 0) {
      const nextSong = this.queue.shift()
      this.playTrack(nextSong)
    } else {
      // Loop through campus default playlist
      this.playlistIndex = (this.playlistIndex + 1) % this.defaultPlaylist.length
      const nextDefaultSong = this.defaultPlaylist[this.playlistIndex]
      this.playTrack(nextDefaultSong)
    }
  }

  /**
   * Skips to the previous track or replays current
   */
  skipPrev() {
    if (this.currentTime > 3) {
      this.seek(0)
    } else if (this.history.length > 0) {
      const prevTrack = this.history.shift()
      this.playTrack(prevTrack)
    } else {
      this.playlistIndex =
        (this.playlistIndex - 1 + this.defaultPlaylist.length) % this.defaultPlaylist.length
      this.playTrack(this.defaultPlaylist[this.playlistIndex])
    }
  }

  /**
   * Skip forward to next track (Queue or next rotation)
   */
  skipNext() {
    this.advanceNext()
  }
}

export const audioEngine = new AudioEngine()
