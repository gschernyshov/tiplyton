'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Icon } from '@iconify/react'
import { useAuthStore } from '../../store/auth.store'
import { useLike } from '../../hooks/useLike'
import { useFavorite } from '../../hooks/useFavorite'
import { useDeletePost } from '../../hooks/useDeletePost'
import { TPost } from '../../types/post'
import { useUserStore } from '../../store/user.store'
import Link from 'next/link'

interface IProps {
  category: string
  post: TPost
  onDeletePostItem: () => void
}

export const PostItem = ({ category, post, onDeletePostItem }: IProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const dataUser = useUserStore(state => state.dataUser)
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
    handleFavorite,
  } = useFavorite({
    postId: post.id,
    initialFavorited: post.favoritedByUser,
    initialFavoritesCount: post._count.favorites,
  })
  const {
    isDeleted,
    isPendingDelete,
    error,
    handleDeletePost,
  } = useDeletePost()

  useEffect(() => {
    if(isDeleted) {
      onDeletePostItem()
      return 
    }

    if (pathname !== '/profile') return

    if (category === 'Понравившиеся' && !liked) {
      onDeletePostItem()
    }
    if (category === 'Избранные' && !favorited) {
      onDeletePostItem()
    }
  }, [isDeleted, onDeletePostItem, pathname, category, liked, favorited ])
  
  return (
    <Card 
      className="relative w-full bg-orange shadow-md shadow-white/20"
    >
      {isPendingDelete && (
        <div className="absolute inset-0 flex justify-center items-center z-25">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs"></div>
        </div>
      )}

      <CardHeader className="justify-between gap-1">
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
        <Button
          color="primary"
          radius="full"
          size="sm"
          className="bg-black shadow-sm shadow-black/50 text-white"
          onPress={() => router.push(`/post/${post.id}`)}
        >
          Задонатить
        </Button>
      </CardHeader>
      <CardBody className="flex-row justify-between items-start gap-2 py-4 text-black">
        <div className="flex flex-col gap-1">
          <h3 className="text-md">{post.title}</h3>
          <p className="text-small text-default-700">{post.content}</p>
        </div>
        <div className="flex flex-col gap-2">
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
                  ${!liked
                    ? 'text-gray hover:text-orange'
                    : 'text-orange hover:text-orange/90'
                  } 
                  ${!isPendingLike 
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-not-allowed opacity-70' 
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
                  ${!favorited
                    ? 'text-gray hover:text-orange'
                    : 'text-orange hover:text-orange/90'
                  } 
                  ${!isPendingFavorite
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-not-allowed opacity-70' 
                  }
                `}
              />
            </button>
          </div>
          {(((userId === post.authorId) && (pathname === '/profile')) || (dataUser?.role === 'ADMIN')) &&
            <div 
              className={`flex flex-col gap-2 py-2 px-1 bg-black shadow-sm shadow-black/50 rounded-lg
                ${(userId !== post.authorId) && (dataUser?.role === 'ADMIN') && 'border border-2 border-gray'}
              `}
            >
              <Popover placement="left">
                <PopoverTrigger>
                  <Button 
                    className="h-auto min-w-auto p-0 bg-black rounded-none"
                  >
                    <Icon 
                      icon="material-symbols:delete-outline-rounded" 
                      height="20" 
                      width="20" 
                      className={`transition-colors duration-200 text-gray hover:text-orange
                        ${!isPendingDelete 
                          ? 'cursor-pointer hover:scale-110'
                          : 'cursor-not-allowed opacity-70' 
                        }
                      `}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="items-start gap-2 p-3 bg-black">
                  {!error ?
                    <h3 className="text-small">Вы уверены, что хотите<br />удалить пост?</h3>
                    :
                    <h3 className="text-small">{error}</h3>
                  }
                  <Button
                    isLoading={isPendingDelete}
                    isDisabled={isPendingDelete}
                    size="sm"
                    className="bg-orange"
                    onPress={() => handleDeletePost(post.id)}
                  >
                    {!isPendingDelete ? "Удалить" : "Удаление..."}
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          }
        </div>
      </CardBody>
      <CardFooter className="justify-between items-end gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-x-2 flex-wrap">
            <div className="flex gap-1">
              <p className="text-small font-semibold text-default-700">{likesCount}</p>
              <p className="text-small text-default-700">Нрав. /</p>
            </div>
            <div className="flex gap-1">
              <p className="text-small font-semibold text-default-700">{favoritesCount}</p>
              <p className="text-small text-default-700">Избр. /</p>
            </div>
            <div className="flex gap-1">
              <p className="text-small font-semibold text-default-700">{post.totalDonations}</p>
              <p className="text-small text-default-700">Ton собрано</p>
            </div>
          </div>
        </div>
        <p className="min-w-[125px] text-small text-black">
          от {post.createdAt.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </p>
      </CardFooter>
    </Card>
  )
}