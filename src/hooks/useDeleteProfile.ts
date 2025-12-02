'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useUserStore } from '../store/user.store'
import { signOutAction } from '../actions/sign-out'
import { deleteProfile } from '../actions/delete-profile'

export const useDeleteProfile = () => {
  const setAuthState = useAuthStore(state => state.setAuthState)
  const clearDataUser = useUserStore(state => state.clearDataUser)
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [isLoadingDeleteProfile, setIsLoadingDeleteProfile] = useState(false)

  const handleDeleteAccount = useCallback(async () => {
    if(!userId) return

    setIsLoadingDeleteProfile(true)
    try {
      const result = await deleteProfile()
      
      if (result.success) {
        await signOutAction()
        setAuthState('unauthenticated', null)
        clearDataUser()
      } else {
        console.error(result.error)
      }
    } catch (e) {
      console.error('При удалении профиля возникла ошибка: ', e)
    } finally {
      setIsLoadingDeleteProfile(false)
    }
  }, [userId, setAuthState, clearDataUser])

  return {
    handleDeleteAccount,
    isLoadingDeleteProfile,
  }
}
