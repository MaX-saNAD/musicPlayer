import { useState } from 'react'
import { useMusic } from '../hooks/useMusic'

function Playlists() {
  const {
    allSongs,
    playlists,
    createNewPlaylist,
    addSongToPlaylist,
    currentTrackIndex,
    deletePlaylist,
    handlePlaySong,
  } = useMusic()

  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  function handleCreatePlaylist() {
    if (
      !newPlaylistName.trim() &&
      playlists.find((e) => e.name === newPlaylistName) !== -1
    )
      return
    createNewPlaylist(newPlaylistName)
    setNewPlaylistName('')
  }

  const filteredSongs = allSongs.filter((song) => {
    const matches =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const isAlreadyExist = selectedPlaylist?.songs.some((e) => {
      return song.id === e.id
    })
    return matches && !isAlreadyExist
  })

  function handleAddSongToPlaylist(song) {
    if (!selectedPlaylist) return
    setSearchQuery('')
    setShowDropdown(false)
    setSelectedPlaylist(null)
    if (!selectedPlaylist.songs.some((e) => e.id === song.id)) {
      addSongToPlaylist(selectedPlaylist?.id, song)
    }
  }

  function handlePlayFromPlaylist(song) {
    const globalIndex = allSongs.findIndex((s) => s.id === song.id)
    handlePlaySong(globalIndex)
  }

  function handleDeletePlaylistConfirmation(playlistId) {
    if (window.confirm('Are you sure you want to delete this playlist'))
      deletePlaylist(playlistId)
  }
  return (
    <div className="playlists">
      <h2>Playlists</h2>
      <div className="create-playlist">
        <h3>Create New Playlist</h3>
        <div className="playlist-form">
          <input
            type="text"
            className="playlist-input"
            aria-label="New playlist name"
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button className="create-btn" onClick={handleCreatePlaylist}>
            Create
          </button>
        </div>
      </div>
      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p className="empty-message">No playlists created yet</p>
        ) : (
          playlists.map((p) => (
            <div className="playlist-item" key={p.id}>
              <div className="playlist-header">
                <h3 className="playlist-name">{p.name}</h3>
                <div className="playlist-actions">
                  {/* <button className="add-song-btn"></button> */}
                  <button
                    className="delete-playlist-btn"
                    onClick={() => handleDeletePlaylistConfirmation(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="add-song-section">
                <div className="search-container">
                  <input
                    type="text"
                    className="song-search-input"
                    aria-label={`Add a song to ${p.name}`}
                    placeholder="Search a song to add"
                    value={selectedPlaylist?.id === p.id ? searchQuery : ''}
                    onChange={(e) => {
                      setSelectedPlaylist(p)
                      setSearchQuery(e.target.value)
                      setShowDropdown(e.target.value.length > 0)
                    }}
                    onFocus={(e) => {
                      setSearchQuery(e.target.value)
                      setShowDropdown(e.target.value.length > 0)
                    }}
                  />
                  {selectedPlaylist?.id === p.id && showDropdown && (
                    <div className="song-dropdown">
                      {filteredSongs.length === 0 ? (
                        <div className="dropdown-item no-results">
                          No results
                        </div>
                      ) : (
                        filteredSongs.slice(0, 5).map((song) => (
                          <button
                            type="button"
                            className="dropdown-item"
                            key={song.id}
                            onClick={() => handleAddSongToPlaylist(song)}
                          >
                            <span className="song-title">{song.title}</span>
                            <span className="song-artist">{song.artist}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="playlist-songs">
                {p.songs.length === 0 ? (
                  <p className="empty-playlist">No songs in this playlist</p>
                ) : (
                  p.songs.map((e) => (
                    <button
                      type="button"
                      className={`playlist-song ${currentTrackIndex === allSongs.findIndex((s) => s.id === e.id) ? 'active' : ''}`}
                      key={e.id}
                      onClick={() => handlePlayFromPlaylist(e)}
                    >
                      <span className="song-info">
                        <span className="song-title">{e.title}</span>
                        <span className="song-artist">{e.artist}</span>
                      </span>
                      <span className="song-duration">{e.duration}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Playlists
