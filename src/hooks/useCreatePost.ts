'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useTonAuthStore } from '../store/ton.store'
import { createPost } from '../actions/create-post'
import { TFormCreatePost, TStateError } from '../types/form'

export const useCreatePost = () => {
  const router = useRouter()  
  const session = useAuthStore(state => state.session)
  const wallet = useTonAuthStore(state => state.wallet)
  const userId: string | undefined = session?.user.id
  const [formData, setFormData] = useState<TFormCreatePost>({
    title: '',
    content: '',
  })
  const [isLoadingCreatePost, setIsLoadingCreatePost] = useState<boolean>(false)
  const [stateError, setStateError] = useState<TStateError>({
    error: false,
    message: '',
  })

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setStateError({ error: false, message: '' })
  }, [])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setStateError({ error: true, message: 'При создание поста возникла ошибка: пользователь на авторизован'})
      return
    }

    if (!wallet) {
      setStateError({ error: true, message: 'При создание поста возникла ошибка: кошелёк не подключён'}) 
      return
    }

    if (formData.title.length < 6) {
      setStateError({ error: true, message: 'Заголовок поста должен быть не менее 6 символов'})
      return
    }
    if (formData.title.length > 256) {
      setStateError({ error: true, message: 'Заголовок поста должен быть не более 256 символов'})
      return
    }

    if (formData.content.length < 6) {
      setStateError({ error: true, message: 'Содержание поста должно быть не менее 6 символов'})
      return
    }
    if (formData.content.length > 512) {
      setStateError({ error: true, message: 'Содержание поста должно быть не более 512 символов'})
      return
    }

    setIsLoadingCreatePost(true)
    try {
      const data = {
        authorAddressWallet: wallet.address,
        ...formData,
      }

      const result = await createPost(data)

      if(result.success) {
        setStateError({ error: false, message: result.message })
        router.push(`/post/${result.id}`)
      } else {
        setStateError({ error: true, message: result.error })
      }
    } catch {
      setStateError({ error: true, message: 'При создание поста возникла ошибка. Попробуйте позже' })
    } finally {
      setIsLoadingCreatePost(false) 
    }
  }, [formData, userId, wallet, router])
    
  return {
    formData,
    isLoadingCreatePost,
    stateError,
    handleChange,
    handleSubmit,
  }
}