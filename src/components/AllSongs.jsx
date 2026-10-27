import { useMusic } from '../hooks/useMusic'

function AllSongs() {
  const { allSongs, handlePlaySong, currentTrackIndex } = useMusic()
  return (
    <div className="all-songs">
      <div className="songs-grid">
        {allSongs.length > 0 ? (
          allSongs.map((e, i) => (
            <button
              type="button"
              className={`song-card ${currentTrackIndex === i ? 'active' : ''}`}
              key={e.id}
              onClick={() => handlePlaySong(i)}
              aria-current={currentTrackIndex === i ? 'true' : undefined}
            >
              <span className="song-info">
                <span className="song-title">{e.title}</span>
                <span className="song-artist">{e.artist}</span>
                <span className="song-duration">{e.duration}</span>
              </span>
              <span className="play-button" aria-hidden="true">
                {currentTrackIndex === i ? '♪' : '‣'}
              </span>
            </button>
          ))
        ) : (
          <h2 className="empty-message">There's no songs to play</h2>
        )}
      </div>
    </div>
  )
}
export default AllSongs
