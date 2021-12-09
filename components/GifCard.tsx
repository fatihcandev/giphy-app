/* eslint-disable @next/next/no-img-element */
import { Button, Tooltip } from "antd"
import { HeartOutlined } from "@ant-design/icons"

import { GifFile } from "../types/custom"
import styles from "../styles/Home.module.scss"

interface Props {
  image: GifFile
  favoritedGifs: GifFile[]
  onFavorite: (gif: GifFile) => void
}

const GifCard = ({ image, favoritedGifs, onFavorite }: Props) => {
  const favorited = favoritedGifs.some(
    (favoritedGif) => favoritedGif.id === image.id
  )
  return (
    <a
      key={image.id}
      className={styles.imageWrapper}
      // propagation won't get stopped when using href
      onClick={() => window.open(image.url, "_blank")}
    >
      <img
        src={image.src.url}
        width={image.src.width}
        height={image.src.height}
        alt="gif"
      />
      <span className={styles.detailText}>Click to open in GIPHY</span>
      <Tooltip title={favorited ? "Remove from favorites" : "Add to favorites"}>
        <Button
          type="primary"
          icon={<HeartOutlined />}
          className={styles.likeButton}
          shape="circle"
          ghost={!favorited}
          onClick={(e) => {
            e.stopPropagation()
            onFavorite(image)
          }}
        />
      </Tooltip>
    </a>
  )
}

export default GifCard
