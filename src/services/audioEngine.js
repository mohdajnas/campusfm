// Audio Engine: Full-Length Song Stream & Dynamic Queue Player for MESCE FM 108.1
import { DEFAULT_MALAYALAM_PLAYLIST } from './musicService'
import { youtubeAudio } from './youtubeAudio'

class AudioEngine {
  constructor() {
    this.audio = new Audio()
    this.audio.preload = 'auto'
    this.audio.crossOrigin = 'anonymous'

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
    this.duration = DEFAULT_MALAYALAM_PLAYLIST[0]?.duration || 193
    this.listeners = new Set()
    this.activeEngine = 'youtube' // 'youtube' | 'html5'

    // Connect YouTube Audio events
    youtubeAudio.onStateChangeCallback = (isPlaying) => {
      this.isPlaying = isPlaying
      this.notify()
    }

    youtubeAudio.onTimeUpdateCallback = (currTime, totalDuration) => {
      this.currentTime = currTime
      if (totalDuration > 0) {
        this.duration = totalDuration
      }
      this.notify()
    }

    youtubeAudio.onEndedCallback = () => {
      console.log('MESCE FM: Full song finished. Auto-advancing to next queued track...')
      this.advanceNext()
    }

    // HTML5 Audio Fallback listeners
    this.audio.addEventListener('playing', () => {
      if (this.activeEngine === 'html5') {
        this.isPlaying = true
        this.notify()
      }
    })

    this.audio.addEventListener('pause', () => {
      if (this.activeEngine === 'html5') {
        this.isPlaying = false
        this.notify()
      }
    })

    this.audio.addEventListener('timeupdate', () => {
      if (this.activeEngine === 'html5') {
        this.currentTime = this.audio.currentTime
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          this.duration = this.audio.duration
        }
        this.notify()
      }
    })

    this.audio.addEventListener('ended', () => {
      if (this.activeEngine === 'html5') {
        this.advanceNext()
      }
    })

    this.audio.addEventListener('error', () => {
      if (this.activeEngine === 'html5') {
        this.advanceNext()
      }
    })
  }

  subscribe(listener) {
    this.listeners.add(listener)
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
      duration: this.duration || 193,
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
    this.audio.volume = this.volume
    youtubeAudio.setVolume(this.volume)
    this.notify()
  }

  seek(seconds) {
    if (isNaN(seconds)) return

    this.currentTime = seconds
    if (this.activeEngine === 'youtube') {
      youtubeAudio.seekTo(seconds)
    } else if (this.audio) {
      this.audio.currentTime = seconds
    }
    this.notify()
  }

  /**
   * Starts playing a specific track in full length
   */
  playTrack(track) {
    if (!track) return

    // Save previous to history
    if (this.currentTrack && this.currentTrack.id !== track.id) {
      this.history.unshift(this.currentTrack)
      if (this.history.length > 20) this.history.pop()
    }

    this.currentTrack = track
    this.currentTime = 0
    this.duration = track.duration || 210

    // Full-length YouTube audio playback (default)
    if (track.youtubeId || track.searchQuery || !track.streamUrl) {
      this.activeEngine = 'youtube'
      this.audio.pause()
      youtubeAudio.playTrack(track)
    } else {
      // Direct stream URL fallback
      this.activeEngine = 'html5'
      youtubeAudio.pause()
      this.audio.src = track.streamUrl
      this.audio.play().catch(() => {
        // Fallback to YouTube if browser blocks direct stream
        this.activeEngine = 'youtube'
        youtubeAudio.playTrack(track)
      })
    }

    this.isPlaying = true
    this.notify()
  }

  togglePlay(overrideTrack) {
    if (this.isPlaying) {
      this.pause()
    } else {
      if (overrideTrack) {
        this.playTrack(overrideTrack)
      } else if (this.currentTrack) {
        if (this.activeEngine === 'youtube') {
          youtubeAudio.togglePlay()
          this.isPlaying = true
          this.notify()
        } else {
          this.audio.play().catch(() => {
            this.playTrack(this.currentTrack)
          })
        }
      } else {
        this.playTrack(this.defaultPlaylist[0])
      }
    }
  }

  pause() {
    this.isPlaying = false
    youtubeAudio.pause()
    this.audio.pause()
    this.notify()
  }

  /**
   * Adds a track to the playback queue.
   * If playNext is true (standard for song requests / dedications),
   * inserts it at index 0 so it plays right after the current song!
   */
  addToQueue(track, playNext = true) {
    if (!track) return

    if (playNext) {
      this.queue.unshift(track) // Plays right after current track!
    } else {
      this.queue.push(track)
    }

    // If station is currently stopped, start playing it immediately
    if (!this.isPlaying && !this.currentTrack) {
      const next = this.queue.shift()
      this.playTrack(next)
      return
    }

    this.notify()
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1)
      this.notify()
    }
  }

  /**
   * Advances to next track:
   * 1. If queue has items (requested songs), plays the first one.
   * 2. If queue is empty, plays the next full song from campus rotation.
   */
  advanceNext() {
    if (this.queue.length > 0) {
      const nextSong = this.queue.shift()
      this.playTrack(nextSong)
    } else {
      this.playlistIndex = (this.playlistIndex + 1) % this.defaultPlaylist.length
      const nextDefault = this.defaultPlaylist[this.playlistIndex]
      this.playTrack(nextDefault)
    }
  }

  skipPrev() {
    if (this.currentTime > 5) {
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

  skipNext() {
    this.advanceNext()
  }
}

export const audioEngine = new AudioEngine()
