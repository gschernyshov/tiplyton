'use server'

import prisma from './prisma'
import { TUser } from '../types/user'
import { auth } from '../auth/auth'

type TGetUserByEmailData = {
  email: string
}

type TGetUserByEmailResponse = 
  {
    id: string,
    password: string,
  } 
  | 
  null

type TGetUserByIDResponse = 
  { 
    success: true
    user: TUser 
  } 
  | 
  { 
    success: false
    error: string 
  }

export async function getUserByEmail({ 
  email 
}: TGetUserByEmailData): Promise<
  TGetUserByEmailResponse
> {
  try {
    return await prisma.user.findUnique({
      where: {
        email,
      }, 
      select: {
        id: true,
        password: true,
      },
    })
  } catch (error) {
    console.error('При получении данных пользователя возникла ошибка: ', error)
    return null
  }
}

export async function getUserByID(): Promise<
  TGetUserByIDResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return {
        success: false,
        error: 'При получении данных пользователя возникла ошибка: пользователь не авторизован',
      }
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
      },
      select: {
        name: true,
        photoUrl: true,
        tgId: true,
        username: true,
        email: true,
        description: true,
        role: true,
        status: true,
      },
    })

    if (!user) {
      return { 
        success: false,
        error: 'При получении данных пользователя возникла ошибка: пользователь не найден',
      }
    }

    return { 
      success: true,
      user,
    }
  } catch (error) {
    console.error('При получении данных пользователя возникла ошибка: ', error)
    
    return {
      success: false,
      error: 'При получении данных пользователя возникла ошибка',
    }
  }
}