'use server'

import { signIn } from '../auth/auth'
import { AuthError } from 'next-auth'
import prisma from '../utils/prisma'
import { signInSchema } from '../schema/zod'
import { ZodError } from 'zod'

type TSignInWithCredentialsData = {
  name: string
  photoUrl: string
  tgId: string
  username: string
  email: string
  password: string
}

type TSignInWithCredentialsResponse = 
  { 
    success: true
    message: string
  } 
  | 
  { success: false
    error: string 
  }

export async function signInWithCredentials(
  data: TSignInWithCredentialsData
): Promise<
  TSignInWithCredentialsResponse
> {
  try {
    if (!data) {
      return { 
        success: false, 
        error: 'При авторизации возникла ошибка: присутсвуют пустые поля',
      }
    }
    
    const {email, password, ...userData} = await signInSchema.parseAsync(data)

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (signInResult.error) {
      return { 
        success: false, 
        error: 'При авторизации возникла ошибка',
      }
    }

    await prisma.user.update({
      where: { 
        email: email,
      },
      data: {
        ...userData,
      }
    })

    return { 
      success: true,
      message: 'Успешная авторизация',
    }
  } catch (error) {
    if (error instanceof ZodError) {
      
      const messageError = error.issues.map(issue => issue.message).join(', ') 
      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }

    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { 
          success: false,
          error: 'При авторизации возникла ошибка: неверный ввод данных',
        }
      }
    }

    console.error('При авторизации возникла ошибка: ', error)
    
    return { 
      success: false,
      error: 'При авторизации возникла ошибка',
    }
  }
}