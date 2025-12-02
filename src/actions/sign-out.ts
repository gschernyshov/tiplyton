'use server'

import { auth, signOut } from '../auth/auth'

type TSignOutActionResponse = 
  { 
    success: true
    message: string
  } 
  | 
  { success: false
    error: string 
  }

export async function signOutAction(): Promise<TSignOutActionResponse> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return { 
        success: false,
        error: 'При выходе из системы возникла ошибка: пользователь не авторизован',
      }
    }

    await signOut({ 
      redirect: false,
    })
    
    return { 
      success: true,
      message: 'Успешный выход из системы',
    }
  } catch (error) {
    console.error('При выходе из системы возникла ошибка: ', error)

    return { 
      success: false,
      error: 'При выходе из системы возникла ошибка',
    }
  }
}