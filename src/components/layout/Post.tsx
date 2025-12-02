'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Avatar } from '@heroui/avatar'
import { Icon } from '@iconify/react'
import { DonateForm } from '../../forms/donate'
import { useLike } from '@/src/hooks/useLike'
import { useFavorite } from '@/src/hooks/useFavorite'
import { TPost } from '../../types/post'

interface IProps {
  post: TPost
}

export const Post = ({ post }: IProps) => {
  const [countDonations, setCountDonations] = useState<number>(post._count.donations!)
  const [totalDonations, setTotalDonations] = useState<number>(post.totalDonations)
  const { 
    liked, 
    likesCount, 
    isPendingLike, 
    handleLike 
  } = useLike({
    postId: post.id,
    initialLiked: post.likedByUser,
    initialLikesCount: post._count.likes,
  })
  const { 
    favorited, 
    favoritesCount, 
    isPendingFavorite, 
    handleFavorite 
  } = useFavorite({
    postId: post.id,
    initialFavorited: post.favoritedByUser,
    initialFavoritesCount: post._count.favorites,
  })
  
  return (
    <>
      <Card 
        className="w-full bg-orange shadow-md shadow-white/20"
      >
        <CardHeader className="justify-between">
          <Link href={`https://t.me/${post.author.username}`}>
            <div className="flex gap-3">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={post.author.photoUrl}
              />
              <div className="flex flex-col justify-center items-start gap-1">
                <h4 className="text-small font-semibold leading-none text-black">{post.author.name}</h4>
                <h5 className="text-small tracking-tight text-default-700">{post.author.username}</h5>
              </div>
            </div>
          </Link>
        </CardHeader>
        <CardBody className="flex-row justify-between items-start gap-2 py-4 text-black">
          <div className="flex flex-col gap-1">
            <h3 className="text-md">{post.title}</h3>
            <p className="text-small text-default-700">{post.content}</p>
          </div>
          <div className="flex flex-col gap-2 py-2 px-1 bg-black shadow-sm shadow-black/50 rounded-lg">
            <button
              disabled={isPendingLike}
              type="button"
              onClick={handleLike}
            >
              <Icon 
                icon="weui:like-filled" 
                height="25"
                width="25" 
                className={`transition-colors duration-200 
                  ${liked
                    ? 'text-orange hover:text-orange/90'
                    : 'text-gray hover:text-orange'
                  } 
                  ${isPendingLike 
                    ? 'cursor-not-allowed opacity-70' 
                    : 'cursor-pointer hover:scale-110'
                  }
                `}
              />
            </button>
            <button
              disabled={isPendingFavorite}
              type="button"
              onClick={handleFavorite}
            >
              <Icon 
                icon="fontisto:favorite" 
                height="30"
                width="25" 
                className={`transition-colors duration-200 
                  ${favorited
                    ? 'text-orange hover:text-orange/90'
                    : 'text-gray hover:text-orange'
                  } 
                  ${isPendingFavorite
                    ? 'cursor-not-allowed opacity-70' 
                    : 'cursor-pointer hover:scale-110'
                  }
                `}
              />
            </button>
          </div>
        </CardBody>
        <CardFooter className="justify-between items-end gap-2">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="flex gap-1">
                  <p className="text-small font-semibold text-default-700">{likesCount}</p>
                  <p className="text-small text-default-700">Нрав. /</p>
              </div>
              <div className="flex gap-1">
                  <p className="text-small font-semibold text-default-700">{favoritesCount}</p>
                  <p className="text-small text-default-700">Избр. /</p>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <p className="text-small text-default-700">Собрано</p>
              <p className="text-small font-semibold text-default-700">{countDonations}</p>
              <p className="text-small text-default-700">дон.</p>
              {totalDonations !== 0 && (
                <>
                  <p className="text-small font-semibold text-default-700">{totalDonations}</p>
                  <p className="text-small text-default-700">Ton</p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-small text-right font-semibold text-black">
              от {post.createdAt.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </CardFooter>
      </Card>
      
      {post.authorAddressWallet && post.authorId &&
        <DonateForm 
          postId={post.id}
          authorId={post.authorId} 
          authorAddressWallet={post.authorAddressWallet} 
          setCountDonations={setCountDonations}
          setTotalDonations={setTotalDonations}
        />
      }
    </>
  )
}
