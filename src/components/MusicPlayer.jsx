import { useEffect, useRef } from 'react'
import { useMusic } from '../hooks/useMusic'

function MusicPlayer() {
  const {
    currentTrack,
    setCurrentTrack,
    formatTime,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    nextTrack,
    prevTrack,
    isPlaying,
    play,
    pause,
    volume,
    setVolume,
  } = useMusic()
  const audioRef = useRef(null)
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  function handleTimeChange(e) {
    const audio = audioRef.current
    if (!audio) return
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
  }

  function handleVolumeChange(e) {
    const audio = audioRef.current
    if (!audio) return
    const newVolume = e.target.value
    setVolume(newVolume)
    audio.volume = newVolume
  }

  useEffect(() => {
    const savedCurrentTime = localStorage.getItem('currentTime')
    const audio = audioRef.current
    if (!audio) return
    if (savedCurrentTime) audio.currentTime = JSON.parse(savedCurrentTime)
    setCurrentTime(JSON.parse(savedCurrentTime))
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      nextTrack()
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadMetadata)
    audio.addEventListener('canplay', handleLoadMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadMetadata)
      audio.removeEventListener('canplay', handleLoadMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [setDuration, setCurrentTrack, setCurrentTime, nextTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    isPlaying ? audio.play().catch((err) => console.error(err)) : audio.pause()
  }, [isPlaying, currentTrack])

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        src={currentTrack.url}
      ></audio>
      <div className="track-info">
        <h3 className="track-title">{currentTrack.title}</h3>
        <p className="track-artist">{currentTrack.artist}</p>
      </div>
      <div className="progress-container">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          aria-label="Seek"
          style={{ '--progress': `${progress}%` }}
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={(e) => handleTimeChange(e)}
        />
        <span className="time">{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <button
          type="button"
          className="control-btn"
          onClick={prevTrack}
          aria-label="Previous track"
        >
          ⏮
        </button>
        <button
          type="button"
          className="control-btn play-btn"
          onClick={() => (isPlaying ? pause() : play())}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className="control-btn"
          onClick={nextTrack}
          aria-label="Next track"
        >
          ⏭
        </button>
      </div>
      <div className="volume-container">
        <div className="volume-icon" aria-hidden="true">
          {+volume === 0 ? '🔈' : +volume <= 0.5 ? '🔉' : '🔊'}
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          className="volume-bar"
          aria-label="Volume"
          value={volume}
          onChange={(e) => handleVolumeChange(e)}
        />
      </div>
    </div>
  )
}

export default MusicPlayer
