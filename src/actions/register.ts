'use server'

import prisma from '../utils/prisma'
import { registerSchema } from '../schema/zod'
import { ZodError } from 'zod'
import { getUserByEmail } from '../utils/user'
import { saltAndHashPassword } from '../utils/password'

type TRegisterUserData = {
  name: string
  photoUrl: string
  tgId: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

type TRegisterUserResponse = 
  { 
    success: true
    message: string 
  } 
  | 
  { 
    success: false
    error: string 
  }

export async function registerUser(
  data: TRegisterUserData
): Promise<
  TRegisterUserResponse
> {
  try {
    if (!data) {
      return { 
        success: false,
        error: 'При регистрации возникла ошибка: присутсвуют пустые поля',
      }
    }
    
    const { confirmPassword, ...userData } = await registerSchema.parseAsync(data)
    const { email, password } = userData

    if (password !== confirmPassword) {
      return { 
        success: false,
        error: 'При регистрации возникла ошибка: пароли не совпадают',
      }
    }

    const existingUser = await getUserByEmail({ email })

    if (existingUser) {
      return { 
        success: false,
        error: 'При регистрации возникла ошибка: пользователь с таким Email существует',
      }
    }

    const passwordHash = await saltAndHashPassword(password)
        
    await prisma.user.create({
      data: { 
        ...userData, 
        password: passwordHash,
      }
    })

    return {
      success: true, 
      message: 'Вы успешно зарегистрировались',
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 

      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }

    console.error('При регистрации возникла ошибка: ', error)

    return { 
      success: false, 
      error: 'При регистрации возникла ошибка: возможно, у Вас уже есть аккаунт, привязанный к Вашему Telegram ID',
    }
  }
}