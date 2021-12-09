import { useEffect, useState } from "react"
import { GifFile } from "../types/custom"
import { getFavoritedGifs } from "../utils"

interface UseFavoriteHookReturnArgs {
  favoritedGifs: GifFile[]
  handleFavorite: (favoritedGif: GifFile) => void
}

const useFavorite = (): UseFavoriteHookReturnArgs => {
  const [favoritedGifs, setFavoritedGifs] = useState<GifFile[]>([])

  useEffect(() => {
    const savedFavoritedGifs = getFavoritedGifs()
    setFavoritedGifs(savedFavoritedGifs)
  }, [])

  const handleFavorite = (favoritedGif: GifFile) => {
    if (favoritedGifs.some((gif) => gif.id === favoritedGif.id)) {
      return setFavoritedGifs((prevGifs) => {
        const result = prevGifs.filter((gif) => gif.id !== favoritedGif.id)
        localStorage.setItem("favorites", JSON.stringify(result))
        return result
      })
    }

    const favoritesToSave: GifFile[] = [...favoritedGifs, favoritedGif]
    setFavoritedGifs((prevGifs) => [...prevGifs, favoritedGif])
    localStorage.setItem("favorites", JSON.stringify(favoritesToSave))
  }

  return {
    favoritedGifs,
    handleFavorite,
  }
}

export default useFavorite
