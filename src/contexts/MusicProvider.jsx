import { useEffect, useState } from 'react'
import { MusicContext } from './MusicContext.jsx'
// import js from '@eslint/js'

const songs = [
  {
    id: 1,
    title: 'Doomed',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Doomed.mp3',
    duration: '4:34',
  },
  {
    id: 2,
    title: 'Happy Song',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Happy Song.mp3',
    duration: '3:59',
  },
  {
    id: 3,
    title: 'Throne',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Throne.mp3',
    duration: '3:11',
  },
  {
    id: 4,
    title: 'True Friends',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - True Friends.mp3',
    duration: '3:52',
  },
  {
    id: 5,
    title: 'Follow You',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Follow You.mp3',
    duration: '3:51',
  },
  {
    id: 6,
    title: 'What You Need',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - What You Need.mp3',
    duration: '4:12',
  },
  {
    id: 7,
    title: 'Avalanche',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Avalanche.mp3',
    duration: '4:22',
  },
  {
    id: 8,
    title: 'Run',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Run.mp3',
    duration: '3:42',
  },
  {
    id: 9,
    title: 'Drown',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Drown.mp3',
    duration: '3:42',
  },
  {
    id: 10,
    title: 'Blasphemy',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Blasphemy.mp3',
    duration: '4:35',
  },
  {
    id: 11,
    title: 'Oh No',
    artist: 'Bring me the horizon',
    url: '/songs/Bring Me The Horizon - Oh No.mp3',
    duration: '5:01',
  },
]

export function MusicProvider({ children }) {
  function loadLocal(key, insial) {
    try {
      const value = localStorage.getItem(key)
      return JSON.parse(value) ?? insial
    } catch (error) {
      console.log(error)
      return insial
    }
  }

  const [allSongs, setAllSongs] = useState(songs)
  const [currentTrack, setCurrentTrack] = useState(() =>
    loadLocal('currentTrack', allSongs[0])
  )
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const savedTrack = loadLocal('currentTrack', null)
    const idx = allSongs.findIndex((e) => e.id === savedTrack?.id)
    return idx === -1 ? 0 : idx
  })
  const [currentTime, setCurrentTime] = useState(() =>
    loadLocal('currentTime', 0)
  )
  const [duration, setDuration] = useState(63)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playlists, setPlaylists] = useState(() =>
    loadLocal('musicPlayerPlaylists', [])
  )

  // const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (playlists.length > 0)
      localStorage.setItem('musicPlayerPlaylists', JSON.stringify(playlists))
    else {
      localStorage.removeItem('musicPlayerPlaylists')
    }
  }, [playlists])

  useEffect(() => {
    // if (!isLoaded) return
    localStorage.setItem('currentTrack', JSON.stringify(currentTrack))
    localStorage.setItem('currentTime', JSON.stringify(currentTime))
  }, [currentTrack, currentTime])

  function handlePlaySong(index) {
    setCurrentTrack(allSongs[index])
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function nextTrack() {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length
      setCurrentTrack(allSongs[nextIndex])
      return nextIndex
    })
  }
  function prevTrack() {
    setCurrentTrackIndex((prev) => {
      const prevIndex = prev - 1 < 0 ? allSongs.length - 1 : prev - 1
      setCurrentTrack(allSongs[prevIndex])
      return prevIndex
    })
  }

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)

  function createNewPlaylist(name) {
    const newPlaylist = {
      id: Date.now(),
      name: name,
      songs: [],
    }
    setPlaylists([...playlists, newPlaylist])
  }

  function addSongToPlaylist(playlistId, song) {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId)
          return { ...playlist, songs: [...playlist.songs, song] }
        else return playlist
      })
    )
  }

  function deletePlaylist(playlistId) {
    setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId))
  }
  return (
    <MusicContext.Provider
      value={{
        allSongs,
        setAllSongs,
        currentTrack,
        setCurrentTrack,
        currentTrackIndex,
        currentTime,
        setCurrentTime,
        setCurrentTrackIndex,
        handlePlaySong,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        isPlaying,
        setIsPlaying,
        play,
        pause,
        volume,
        setVolume,
        createNewPlaylist,
        playlists,
        setPlaylists,
        addSongToPlaylist,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}