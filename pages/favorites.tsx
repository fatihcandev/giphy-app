import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Empty, Space, Typography } from "antd"
import Link from "next/link"
import { GifCard } from "../components"
import { useFavorite } from "../hooks"

import styles from "../styles/Home.module.scss"

const Favorites = () => {
  const { favoritedGifs, handleFavorite } = useFavorite()

  return (
    <div className={styles.container}>
      <Link href="/" passHref>
        <Button
          type="primary"
          shape="circle"
          ghost
          size="large"
          icon={<ArrowLeftOutlined />}
        />
      </Link>
      <Typography.Title>Your favorites</Typography.Title>
      {favoritedGifs.length > 0 ? (
        <div className={styles.images}>
          {favoritedGifs.map((gif) => (
            <GifCard
              key={gif.id}
              image={gif}
              favoritedGifs={favoritedGifs}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      ) : (
        <Space direction="vertical">
          <Empty
            description={
              <Space direction="vertical">
                <Typography.Text>
                  You don&apos;t have any favorited gifs.
                </Typography.Text>
                <Link href="/" passHref>
                  <Button type="link" icon={<ArrowLeftOutlined />}>
                    Go back to explore
                  </Button>
                </Link>
              </Space>
            }
          />
        </Space>
      )}
    </div>
  )
}

export default Favorites
