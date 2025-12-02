'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useTelegramStore } from '../store/telegram.store'
import { registerUser } from '../actions/register'
import { validateEmail } from '../lib/validate-email'
import { siteConfig } from '../config/site.config'
import { TFormRegisterData, TStateError } from '../types/form'

export const useRegistration = () => {
  const { baseImageUrlUser } = siteConfig
  const router = useRouter()
  const telegramUser = useTelegramStore((state) => state.telegramUser)
  const [formData, setFormData] = useState<TFormRegisterData>({
    name: telegramUser?.first_name ? telegramUser?.first_name + (telegramUser?.last_name ? ' ' + telegramUser?.last_name : '') : 'Не указано',
    photoUrl: telegramUser?.photo_url || baseImageUrlUser,
    username: telegramUser?.username || 'Не указано',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoadingRegistration, setIsLoadingRegistration] = useState<boolean>(false)
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

    const validateEmailError = validateEmail(formData.email)
    
    if (validateEmailError) {
      setStateError({ error: true, message: validateEmailError})
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setStateError({ error: true, message: 'При регистрации возникла ошибка: пароли не совпадают' })
      return
    }
    
    if (formData.password.length < 6 || formData.confirmPassword.length < 6) {
      setStateError({ error: true, message: 'При регистрации возникла ошибка: пароль должен быть не менее 6 символов' })
      return
    }

    if (formData.password.length > 32 || formData.confirmPassword.length > 32) {
      setStateError({ error: true, message: 'При регистрации возникла ошибка: пароль должен быть не более 32 символов' })
      return
    }

    setIsLoadingRegistration(true)
    try {
      const data = {
        ...formData,
        tgId: telegramUser?.id.toString() || 'Не указано',
      }

      const result = await registerUser(data)

      if(result.success) {
        setStateError({ error: false, message: result.message })
        router.push('/login')
      } else {
        setStateError({ error: true, message: result.error })
      }
    } catch (e) {
      setStateError({ error: true, message: 'При регистрации возникла ошибка' })
    } finally {
      setIsLoadingRegistration(false) 
    }
  }, [formData, router])
    
  return {
    formData,
    isLoadingRegistration,
    stateError,
    handleChange,
    handleSubmit,
  }
}