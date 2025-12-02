'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/auth.store'
import { getPostById } from '../utils/post'
import { TPost } from '../types/post'

export const useGetPost = (postId: string) => {
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [dataPost, setDataPost] = useState<TPost | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!userId) {
      setDataPost(null)
      setError('При получении данных поста возникла ошибка: пользователь не авторизован')
      setIsLoadingPost(false)
      return
    }

    if (!postId) {
      setDataPost(null)
      setError('При получении данных поста возникла ошибка: пост не найден')
      setIsLoadingPost(false)
      return
    }

    let cancelled = false

    const query = async () => {
      setDataPost(null)
      setError(null)

      setIsLoadingPost(true)
      try {
        const data = {
          postId,
        }
        
        const result = await getPostById(data)

        if (cancelled) return
 
        if (result.success) {
          setDataPost(result.post)
        } else {
          console.error(result.error)
          setDataPost(null)
          setError(result.error)
        }
      } catch (e) {
        if (cancelled) return
        console.error('При получении данных поста возникла ошибка: ', e)
        setDataPost(null)
        setError('При получении данных поста возникла ошибка')
      } finally {
        if (cancelled) return
        setIsLoadingPost(false)
      }
    }
    
    query()

    return () => {
      cancelled = true
    }
  }, [userId, postId])

  return {
    dataPost,
    isLoadingPost,
    error
  }
}
