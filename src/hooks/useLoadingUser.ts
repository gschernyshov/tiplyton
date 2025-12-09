'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useUserStore } from '../store/user.store'
import { getUserByID } from '../utils/user'
import { useSignOut } from './useSignOut'

export const useLoadingUser = () => {
  const session = useAuthStore((state) => state.session)
  const { handleSignOut } = useSignOut()
  const userId: string | undefined = session?.user.id
  
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const query = async () => {
      if (useUserStore.getState().isCacheValid()) return

      try {
        const result = await getUserByID()

        if (cancelled) return
 
        if (result.success) {
          useUserStore.getState().setDataUser(result.user)
        } else {
          console.error(result.error)
          handleSignOut()
        }
      } catch (e) {
        if (cancelled) return
        console.error('При получении данных пользователя возникла ошибка: ', e)
        handleSignOut()
      }
    }
    
    query()

    return () => {
      cancelled = true
    }
  }, [userId, handleSignOut])
}

