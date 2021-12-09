export interface Category {
  label: string
  value: string
}

interface PreviewGif {
  url: string
  width: string
  height: string
}

export interface GifResponse {
  id: string
  images: {
    downsized: PreviewGif
  }
  bitly_url: string
}

export interface GiphyResponse {
  data: GifResponse[]
  pagination: {
    total_count: number
  }
}

export interface GifFile {
  id: string
  url: string
  src: {
    url: string
    width: string
    height: string
  }
}

interface SearchFuncArgs {
  query: string
  offset: number
}

// eslint-disable-next-line no-unused-vars
export type SearchFunc = (args: SearchFuncArgs) => Promise<void>

export interface Pagination {
  limit: number
  offset: number
}

export interface RequestQueryParams extends Pagination {
  [key: string]: string | number
}

export interface FavoritedGif {
  id: string
}
