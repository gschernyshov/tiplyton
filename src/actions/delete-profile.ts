'use server'

import { auth } from '../auth/auth'
import prisma from '../utils/prisma'

type TDeleteAccountResponse = 
  { 
    success: true
    message: string 
  } 
  | 
  { 
    success: false
    error: string
  }

export async function deleteProfile(): Promise<
  TDeleteAccountResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return { 
        success: false, 
        error: 'При удалении аккаунта возникла ошибка: пользователь не авторизован',
      }
    }

    await prisma.user.delete({
      where: { 
        id: userId,
      },
    })
  
    return { 
      success: true,
      message: 'Аккаунт успешно удалён',
    }
  } catch (error) {
    console.error('При удалении аккаунта возникла ошибка: ', error)

    return { 
      success: false, 
      error: 'При удалении аккаунта возникла ошибка',
    }
  }
}