'use client'

import { useCallback, useState, useTransition } from 'react'
import { useAuthStore } from '../store/auth.store'
import { toggleLike } from '../actions/like'

type IProps = {
  postId: string
  initialLiked: boolean
  initialLikesCount: number
}

export function useLike({
  postId,
  initialLiked,
  initialLikesCount,
}: IProps) {
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [liked, setLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isPendingLike, startTransitionLike] = useTransition()

  const handleLike = useCallback(() => {
    if (!userId) return

    const newLiked = !liked
    const delta = newLiked ? 1 : -1

    setLiked(newLiked)
    setLikesCount(prev => prev + delta)

    startTransitionLike(async () => {
      try {
        const data = {
          postId,
        }
        
        const result = await toggleLike(data)
        
        if(!result.success) {
          setLiked(!newLiked)
          setLikesCount(prev => prev - delta)
        }
      } catch {
        setLiked(!newLiked)
        setLikesCount(prev => prev - delta)
      }
    })
  }, [userId, postId, liked])

  return {
    liked,
    likesCount,
    isPendingLike,
    handleLike,
  }
}
