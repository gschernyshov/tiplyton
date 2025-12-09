'use client'

import { useState, useCallback, useTransition } from 'react'
import { useAuthStore } from '../store/auth.store'
import { toggleFavorite } from '../actions/favorite'

type IProps = {
  postId: string 
  initialFavorited: boolean 
  initialFavoritesCount: number 
}

export function useFavorite({
  postId,
  initialFavorited,
  initialFavoritesCount,
}: IProps) {
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [favorited, setFavorited] = useState(initialFavorited)
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount)
  const [isPendingFavorite, startTransitionFavorite] = useTransition()

  const handleFavorite = useCallback(() => {
    if (!userId) return

    const newFavorited = !favorited
    const delta = newFavorited ? 1 : -1

    setFavorited(newFavorited)
    setFavoritesCount(prev => prev + delta)

    startTransitionFavorite(async () => {
      try {
        const data = {
          postId,
        }
        
        const result = await toggleFavorite(data)
        
        if(!result.success) {
          setFavorited(!newFavorited)
          setFavoritesCount(prev => prev - delta)
        }
      } catch {
        setFavorited(!newFavorited)
        setFavoritesCount(prev => prev - delta)
      }
    })
  }, [userId, postId, favorited])

  return {
    favorited,
    favoritesCount,
    isPendingFavorite,
    handleFavorite,
  }
}
