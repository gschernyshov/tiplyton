'use server'

import prisma from '../utils/prisma'
import { resetPasswordSchema } from '../schema/zod'
import { ZodError } from 'zod'
import { getUserByEmail } from "../utils/user"
import { generatePassword, saltAndHashPassword } from '../utils/password'
import { sendEmail } from '@/src/utils/send-email'

type TResetPasswordData = {
  email: string
}

type TResetPasswordResponse = 
  { 
    success: true
    message: string 
  } 
  | 
  { 
    success: false
    error: string
  }

export async function resetPassword(
  data: TResetPasswordData
): Promise<
  TResetPasswordResponse
> {
  try {
    if (!data || !data.email) {
      return { 
        success: false, 
        error: 'При сбросе пароля возникла ошибка: отсутствует email',
      }
    }

    const { email }  = await resetPasswordSchema.parseAsync(data)

    const existingUser = await getUserByEmail({ email })

    if (!existingUser) {
      return { 
        success: false, 
        error: 'При сбросе пароля возникла ошибка: пользователь с таким Email не найден',
      }
    }

    const newPassword = await generatePassword()

    const resultSendEmail = await sendEmail({
      email,
      subject: 'Новый пароль для TiplyTon',
      message: newPassword,
    })

    if(!resultSendEmail.success){
      return { 
        success: false, 
        error: 'При отправке письма с паролем возникла ошибка',
      }
    }

    const passwordHash = await saltAndHashPassword(newPassword)

    await prisma.user.update({
      where: { 
        email,
      },
      data: {
        password: passwordHash,
      },
    })

    return {
      success: true,
      message: resultSendEmail.message,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 
      
      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }
    
    console.error('При сбросе пароля возникла ошибка: ', error)

    return { 
      success: false, 
      error: 'При сбросе пароля возникла ошибка',
    }
  }
}