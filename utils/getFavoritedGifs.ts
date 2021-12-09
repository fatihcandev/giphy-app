import { GifFile } from "../types/custom"

const getFavoritedGifs = (): GifFile[] => {
  const prevFavorites = localStorage.getItem("favorites")
  let favorites: GifFile[] = []

  if (prevFavorites) {
    favorites = JSON.parse(prevFavorites)
  }

  return favorites
}

export default getFavoritedGifs
