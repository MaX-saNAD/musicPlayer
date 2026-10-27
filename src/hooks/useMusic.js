import { useContext } from 'react'
import { MusicContext } from '../contexts/MusicContext'

export const useMusic = () => {
  const contextValues = useContext(MusicContext)
  if (!contextValues)
    throw new Error('MusicContext must be called inside MusicProvider')
  return contextValues
}
