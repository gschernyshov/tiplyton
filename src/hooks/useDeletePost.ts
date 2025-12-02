'use client'

import { useState, useCallback } from 'react'
import { deletePost } from '../actions/delete-post'
import { useAuthStore } from '../store/auth.store'

export const useDeletePost = () => {
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [isPendingDelete, setIsPendingDelete] = useState(false)
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeletePost = useCallback(async (postId: string) => {
    if (isPendingDelete) return 

    if(!userId) {
      setError('При удалении поста возникла ошибка: пользователь не авторизован')
      return
    }

    if(!postId) {
      setError('При удалении поста возникла ошибка: пост не найден')
      return
    }

    setIsDeleted(false)
    setError(null)

    setIsPendingDelete(true)
    try {
      const data = {
        postId
      }
      
      const result = await deletePost(data)
      
      if (result.success) {
        setIsDeleted(true)
      } else {
        console.error('При удалении поста возникла ошибка')
        setError('При удалении поста возникла ошибка')
      }
    } catch (e) {
      console.error('При удалении поста возникла ошибка: ', e)
      setError('При удалении поста возникла ошибка')
    } finally {
      setIsPendingDelete(false)
    }
  }, [userId])

  return {
    isPendingDelete,
    isDeleted,
    error,
    handleDeletePost,
  }
}
