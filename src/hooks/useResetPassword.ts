'use client'

import { useRef, useState, useEffect, useCallback, ChangeEvent } from 'react'
import { resetPassword } from '../actions/reset-password'
import { validateEmail } from '../lib/validate-email'
import { TStateError } from '../types/form'

export const useResetPasswordForm = () => {
  const [email, setEmail] = useState<string>('')
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false)
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState<boolean>(false)
  const [stateError, setStateError] = useState<TStateError>({
    error: false,
    message: '',
  })

  const emailRef = useRef<string>(email)
  useEffect(() => {
    emailRef.current = email
  }, [email])
    
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setStateError({ error: false, message: '' })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const value = emailRef.current
    const validateEmailError = validateEmail(value)

    if (validateEmailError) {
      setStateError({ error: true, message: validateEmailError})
      return
    }

    setIsLoadingResetPassword(true)
    try{
      const data = {
        email: value
      }
      
      const result = await resetPassword(data)

      if(result.success) {
        setStateError({ error: false, message: result.message })
        setIsResetPassword(true)
      } else {
        setStateError({ error: true, message: result.error })
      }
    } catch (e) {
      setStateError({ error: true, message: 'При сбросе пароля возникла ошибка' })
    } finally {
      setIsLoadingResetPassword(false)
    }
  }, [email])

  return {
    isResetPassword,
    email,
    isLoadingResetPassword,
    stateError,
    handleChange,
    handleSubmit,
  }
}
