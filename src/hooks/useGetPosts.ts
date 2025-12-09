'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/auth.store'
import { getPosts } from '../utils/post'
import { TPost } from '../types/post'

export const useGetPosts = (
  initialCategory: string = '', 
  limit: number = 10
) => {
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [categoryPosts, setCategoryPosts] = useState(initialCategory)
  const [dataPosts, setDataPosts] = useState<TPost[] | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true)
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    return () => {
      cancelled.current = true
    }
}, [])
  
  useEffect(() => {
    if (!userId) {
      setDataPosts(null)
      setError('При загрузке постов возникла ошибка: пользователь не авторизован')
      setIsLoadingPosts(false)
      return
    }

    if(!categoryPosts) {
      setDataPosts(null)
      setError('При загрузке постов возникла ошибка: категория не найдена')
      setIsLoadingPosts(false)
      return
    }

    const query = async () => {
      setDataPosts(null)
      setError(null)
      setNextCursor(null)

      setIsLoadingPosts(true)      
      try {
        const data = {
          category: categoryPosts,
          limit,
          cursor: null,
        }

        const result = await getPosts(data)

        if (cancelled.current) return
 
        if (result.success) {
          setDataPosts(result.posts)
          setNextCursor(result.nextCursor)
        } else {
          console.error(result.error)
          setDataPosts(null)
          setError(result.error)
        }
      } catch (e) {
        if (cancelled.current) return
        console.error('При загрузке постов возникла ошибка: ', e)
        setDataPosts(null)
        setError('При загрузке постов возникла ошибка')
      } finally {
        if (cancelled.current) return
        setIsLoadingPosts(false)
      }
    }
    
    query()
  }, [userId, categoryPosts, limit])

  const loadMorePosts = useCallback(async () => {
    if (!nextCursor || isLoadingMorePosts) return

    setIsLoadingMorePosts(true)
    try {
      const data = {
        category: categoryPosts,
        limit,
        cursor: nextCursor,
      }

      const result = await getPosts(data)

      if (cancelled.current) return

      if (result.success) {
        setDataPosts(prev => [...(prev ?? []), ...result.posts])
        setNextCursor(result.nextCursor)
      } else {
        console.error('При дозагрузке постов возникла ошибка')
      }
    } catch (e) {
      if (cancelled.current) return
      console.error('При дозагрузке постов возникла ошибка: ', e)
    } finally {
      if (cancelled.current) return
      setIsLoadingMorePosts(false)
    }
  }, [nextCursor, isLoadingMorePosts, categoryPosts, limit])

  return {
    categoryPosts,
    dataPosts,
    isLoadingPosts,
    isLoadingMorePosts, 
    error,      
    nextCursor,
    setCategoryPosts, 
    setDataPosts,
    loadMorePosts,  
  }
} 
