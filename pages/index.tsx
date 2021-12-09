/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import InfiniteScroll from "react-infinite-scroll-component"
import { Button, Input, Select, Typography } from "antd"
import { HeartOutlined, LoadingOutlined } from "@ant-design/icons"

import { GifCard } from "../components"
import {
  Category,
  GifFile,
  GifResponse,
  GiphyResponse,
  RequestQueryParams,
  SearchFunc,
} from "../types/custom"
import styles from "../styles/Home.module.scss"
import { useFavorite } from "../hooks"
import Link from "next/link"

const options: Category[] = [
  {
    label: "Select a category",
    value: "",
  },
  {
    label: "Funny",
    value: "funny",
  },
  {
    label: "TV Series",
    value: "tvSeries",
  },
  {
    label: "Movies",
    value: "movies",
  },
]

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [images, setImages] = useState<GifFile[]>([])
  const [totalImages, setTotalImages] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const { favoritedGifs, handleFavorite } = useFavorite()

  /*
  Giphy returns the same gifs after refetching. 
  This causes rendering problems because children gets rendered with the same key so UI gets confusing sometimes. 
  Just a reminder.
   */

  const handleSearch: SearchFunc = useCallback(
    async ({ query, offset = 0 }) => {
      const queryParams: RequestQueryParams = {
        api_key: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
        q: query,
        limit: 24,
        offset,
      }
      const queryString: string = Object.keys(queryParams)
        .map((key) => `${key}=${queryParams[key]}`)
        .join("&")
      const url = `https://api.giphy.com/v1/gifs/search?${queryString}`
      try {
        const response = await fetch(url)
        const result: GiphyResponse = await response.json()
        setTotalImages(result.pagination.total_count)
        const data: GifFile[] = result.data.map((gif: GifResponse) => {
          const { downsized } = gif.images
          return {
            id: gif.id,
            src: {
              url: downsized.url,
              width: downsized.width,
              height: downsized.height,
            },
            url: gif.bitly_url,
          }
        })
        if (offset > 0) {
          return setImages((prevData) => [...prevData, ...data])
        }
        setImages(data)
      } catch (error) {
        console.log(error)
      }
    },
    []
  )

  const handleChangeCategory = async (category: string) => {
    setSearchQuery("")
    setError("")
    setSelectedCategory(category)
    await handleSearch({ query: category, offset: 0 })
  }

  const handleSearchClick = async () => {
    if (searchQuery.length < 3) {
      return setError("You should enter more than 3 characters!")
    }

    setSelectedCategory("")
    setError("")
    await handleSearch({ query: searchQuery, offset: 0 })
  }

  const handleFetchMore = async () => {
    setOffset((prev) => prev + 25)
    handleSearch({
      query: selectedCategory || searchQuery,
      offset: offset + 25,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          size="large"
          placeholder="Search by a keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearchClick}
          suffix={
            <Button type="primary" onClick={handleSearchClick}>
              Search
            </Button>
          }
          className={styles.keywordInput}
        />
        <Typography.Text>or</Typography.Text>
        <Select
          size="large"
          value={selectedCategory}
          onChange={(value) => handleChangeCategory(value)}
          className={styles.categoriesSelect}
        >
          {options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <Link href="/favorites" passHref>
          <Button
            type="link"
            icon={<HeartOutlined />}
            className={styles.favoritesLink}
          >
            Favorites
          </Button>
        </Link>
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {images.length > 0 && (
        <InfiniteScroll
          dataLength={images.length}
          next={handleFetchMore}
          hasMore={totalImages > images.length}
          loader={<LoadingOutlined style={{ fontSize: 32 }} />}
          className={styles.images}
          endMessage={
            images.length > 0 ? (
              <Typography.Text>
                Yay! You have seen all the gifs!
              </Typography.Text>
            ) : null
          }
          scrollThreshold={1}
        >
          {images.map((image) => (
            <GifCard
              key={image.id}
              image={image}
              favoritedGifs={favoritedGifs}
              onFavorite={handleFavorite}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  )
}

export default Home
