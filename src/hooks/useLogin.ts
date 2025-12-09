'use client'

import { useState, useCallback, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useTelegramStore } from '../store/telegram.store'
import { signInWithCredentials } from '../actions/sign-in'
import { validateEmail } from '../lib/validate-email'
import { siteConfig } from '../config/site.config'
import { TFormLoginData, TStateError } from '../types/form'

export const useLogin = () => {
  const { baseImageUrlUser } = siteConfig
  const { update: updateSession } = useSession() 
  const telegramUser = useTelegramStore(state => state.telegramUser)
  const [formData, setFormData] = useState<TFormLoginData>({
    email: '',
    password: '',
  })
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false)
  const [stateError, setStateError] = useState<TStateError>({
    error: false,
    message: '',
  })

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setStateError({ error: false, message: '' })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const validateEmailError = validateEmail(formData.email)

    if (validateEmailError) {
      setStateError({ error: true, message: validateEmailError})
      return
    }
    
    if (formData.password.length < 6) {
      setStateError({ error: true, message: 'При авторизации возникла ошибка: пароль должен быть не менее 6 символов' })
      return 
    }

    if (formData.password.length > 32) {
      setStateError({ error: true, message: 'При авторизации возникла ошибка: пароль должен быть не более 32 символов' })
      return
    }

    setIsLoadingLogin(true)
    try{
      const data = {
        ...formData,
        name: telegramUser?.first_name ? telegramUser?.first_name + (telegramUser?.last_name ? ' ' + telegramUser?.last_name : '') : 'Не указано',
        photoUrl: telegramUser?.photo_url || baseImageUrlUser,
        tgId: telegramUser?.id.toString() || 'Не указано',
        username: telegramUser?.username || 'Не указано',
      }
      
      const result = await signInWithCredentials(data)

      if(result.success) {
        setStateError({ error: false, message: result.message })
        await updateSession()
      } else {
        setStateError({ error: true, message: result.error })
      }
    } catch {
      setStateError({ error: true, message: 'При авторизации возникла ошибка' })
    } finally {
      setIsLoadingLogin(false)
    }
  }, [
    baseImageUrlUser,
    telegramUser?.first_name,
    telegramUser?.last_name,
    telegramUser?.photo_url,
    telegramUser?.id,
    telegramUser?.username,
    formData, 
    updateSession,
  ])

  return {
    formData,
    isLoadingLogin,
    stateError,
    handleChange,
    handleSubmit,
  }
}
