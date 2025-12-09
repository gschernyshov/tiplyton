'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useUserStore } from '../store/user.store'
import { updateProfileDescription } from '../actions/update-profile-description'
import { TEditDescriptionUser, TStateError } from '../types/form'

export const useUpdateProfileDescription = () => {
  const dataUser = useUserStore(state => state.dataUser)
  const updateDataUser = useUserStore(state => state.updateDataUser)
  const session = useAuthStore(state => state.session)
  const userId: string | undefined = session?.user.id
  const [editDescriptionUser, setEditDescriptionUser] = useState<TEditDescriptionUser>({
    state: false,
    isLoading: false,
    value: dataUser?.description ?? ''
  })
  const [stateError, setStateError] = useState<TStateError>({
    error: false,
    message: '',
  })

  const descriptionValueRef = useRef(editDescriptionUser.value)
  useEffect(() => {
    descriptionValueRef.current = editDescriptionUser.value
  }, [editDescriptionUser.value])

  const onOpenFormEditDescriptionUser = useCallback(() => {
    setEditDescriptionUser(prev => ({ ...prev, state: true }))
  }, [])

  const onCloseFormEditDescriptionUser = useCallback(() => {
    setEditDescriptionUser(prev => ({ ...prev, state: false }))
  }, [])

  const handleChangeDescriptionUser = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEditDescriptionUser(prev => ({ ...prev, value }))
    setStateError({ error: false, message: ''})
  }, [])

  const handleEditDescriptionUser = useCallback(async () => {
    if(!userId) {
      setStateError({ error: true, message: 'При обновлении описания профиля возникла ошибка: пользователь не авторизован' })
      return
    }

    const value = descriptionValueRef.current

    if (value === dataUser?.description) {
      setStateError({ error: true, message: 'Вы не изменили описание'})
      return
    }
    if(value.length < 6) {
      setStateError({ error: true, message: 'Описание должно быть не менее 6 символов'})
      return
    }
    if(value.length > 256) {
      setStateError({ error: true, message: 'Описание должен быть не более 256 символов'})
      return
    }

    setEditDescriptionUser(prev => ({...prev, isLoading: true}))
    try {
      const data = {
        description: value,
      }

      const result = await updateProfileDescription(data)
      
      if (result.success){
        updateDataUser(value)
      } else {
        setStateError({ error: true, message: result.error })
      } 
    } catch (e) {
      console.error('При обновлении описания профиля возникла ошибка: ', e)
    } finally {
      setEditDescriptionUser(prev => ({...prev, state: false, isLoading: false}))
    }
  }, [userId, dataUser?.description, updateDataUser])

  return {
    onOpenFormEditDescriptionUser,
    onCloseFormEditDescriptionUser,
    editDescriptionUser,
    stateError,
    handleChangeDescriptionUser,
    handleEditDescriptionUser,
  }
}