'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useUserStore } from '../store/user.store'
import { signOutAction } from '../actions/sign-out'

export const useSignOut = () => {
  const setAuthState = useAuthStore(state => state.setAuthState)
  const clearDataUser = useUserStore(state => state.clearDataUser)
  const [isLoadingSignOut, setIsLoadingSignOut] = useState(false)
      
  const handleSignOut = useCallback(async () => {
    setIsLoadingSignOut(true)
    try {
      await signOutAction()
      setAuthState('unauthenticated', null)
      clearDataUser()
    } catch (e) {
      console.error('При выходе из системы возникла ошибка: ', e)
    } finally {
      setIsLoadingSignOut(false)
    }
  }, [setAuthState, clearDataUser])

  return {
    isLoadingSignOut,
    handleSignOut,
  }
}
