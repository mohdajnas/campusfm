// YouTube Background Audio Service for MESCE FM 108.1
// Powers full-length (3-5+ minute) song playback for requested and rotation tracks.

class YouTubeAudioService {
  constructor() {
    this.player = null
    this.isReady = false
    this.currentTrack = null
    this.isPlaying = false
    this.volume = 80
    this.pollInterval = null
    this.onStateChangeCallback = null
    this.onTimeUpdateCallback = null
    this.onEndedCallback = null
    this.onErrorCallback = null

    this.loadAPI()
  }

  loadAPI() {
    if (typeof window === 'undefined') return

    if (window.YT && window.YT.Player) {
      this.initPlayer()
      return
    }

    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        this.initPlayer()
      }

      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
    }
  }

  initPlayer() {
    if (typeof document === 'undefined') return
    let container = document.getElementById('mesce-yt-audio-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'mesce-yt-audio-container'
      container.style.position = 'fixed'
      container.style.bottom = '-9999px'
      container.style.left = '-9999px'
      container.style.width = '1px'
      container.style.height = '1px'
      container.style.opacity = '0'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '-999'
      document.body.appendChild(container)
    }

    try {
      this.player = new window.YT.Player('mesce-yt-audio-container', {
        height: '1',
        width: '1',
        videoId: 'M7lc1UVf-VE', // Clean YouTube developer test embed
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            this.isReady = true
            event.target.setVolume(this.volume)
          },
          onStateChange: (event) => {
            this.handlePlayerStateChange(event.data)
          },
          onError: (event) => {
            const code = event.data
            console.warn(`YouTube audio player reported note (code ${code}) for track "${this.currentTrack?.title || 'init'}"`)
            this.isPlaying = false
            this.stopPolling()
            if (this.onStateChangeCallback) this.onStateChangeCallback(false)
            if (this.onErrorCallback) {
              this.onErrorCallback(code, this.currentTrack)
            }
          },
        },
      })
    } catch (err) {
      console.warn('YouTube Player init exception:', err)
    }
  }

  handlePlayerStateChange(state) {
    if (!window.YT) return

    if (state === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true
      this.startPolling()
      if (this.onStateChangeCallback) this.onStateChangeCallback(true)
    } else if (
      state === window.YT.PlayerState.PAUSED ||
      state === window.YT.PlayerState.BUFFERING
    ) {
      if (state === window.YT.PlayerState.PAUSED) {
        this.isPlaying = false
        this.stopPolling()
        if (this.onStateChangeCallback) this.onStateChangeCallback(false)
      }
    } else if (state === window.YT.PlayerState.ENDED) {
      console.log('MESCE FM: Full YouTube track finished playing! Auto-advancing...')
      this.isPlaying = false
      this.stopPolling()
      if (this.onStateChangeCallback) this.onStateChangeCallback(false)
      if (this.onEndedCallback) this.onEndedCallback()
    }
  }

  startPolling() {
    this.stopPolling()
    this.pollInterval = setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const currentTime = this.player.getCurrentTime() || 0
        const duration = this.player.getDuration() || 0
        if (this.onTimeUpdateCallback && duration > 0) {
          this.onTimeUpdateCallback(currentTime, duration)
        }
      }
    }, 250)
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  playTrack(track) {
    this.currentTrack = track

    if (!this.player || !this.isReady) {
      // Re-attempt init if not yet ready
      this.loadAPI()
      setTimeout(() => {
        if (this.player && typeof this.player.loadVideoById === 'function') {
          this.executePlay(track)
        }
      }, 800)
      return
    }

    this.executePlay(track)
  }

  executePlay(track) {
    if (!this.player) return

    try {
      this.player.setVolume(this.volume)

      if (track.youtubeId) {
        this.player.loadVideoById({
          videoId: track.youtubeId,
          startSeconds: 0,
        })
      } else if (track.title) {
        // Query search mode
        const query = `${track.title} ${track.artist || ''} official audio`
        if (typeof this.player.loadPlaylist === 'function') {
          this.player.loadPlaylist({
            listType: 'search',
            list: query,
          })
        } else {
          this.player.loadVideoById({
            videoId: 'tOM-nWPcR4U',
            startSeconds: 0,
          })
        }
      }
      this.isPlaying = true
      if (this.onStateChangeCallback) this.onStateChangeCallback(true)
    } catch (e) {
      console.warn('Error starting YouTube track:', e)
    }
  }

  togglePlay() {
    if (!this.player || !this.isReady) return

    try {
      if (this.isPlaying) {
        this.player.pauseVideo()
      } else {
        this.player.playVideo()
      }
    } catch (e) {
      console.warn(e)
    }
  }

  pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo()
        this.isPlaying = false
        this.stopPolling()
        if (this.onStateChangeCallback) this.onStateChangeCallback(false)
      } catch (e) {
        console.warn(e)
      }
    }
  }

  seekTo(seconds) {
    if (this.player && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(seconds, true)
      } catch (e) {
        console.warn(e)
      }
    }
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(100, Math.round(volPercent * 100)))
    if (this.player && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(this.volume)
      } catch (e) {
        console.warn(e)
      }
    }
  }
}

export const youtubeAudio = new YouTubeAudioService()
