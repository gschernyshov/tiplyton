'use server'

import { auth } from '../auth/auth'
import prisma from '../utils/prisma'
import { updateProfileDescriptionSchema } from '../schema/zod'
import { ZodError } from 'zod'

type TEditDescriptionFuncData = {
  description: string
}

type TEditDescriptionFuncResponse = 
  { 
    success: true
    message: string 
  } 
  |
  { 
    success: false 
    error: string 
  }

export async function updateProfileDescription(
  data: TEditDescriptionFuncData
): Promise<
  TEditDescriptionFuncResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return { 
        success: false,
        error: 'При редактирование описания профиля возникла ошибка: пользователь не авторизован',
      }
    }

    if (!data || !data.description) {
      return { 
        success: false,
        error: 'При редактирование описания профиля возникла ошибка',
      }
    }

    const { description } = await updateProfileDescriptionSchema.parseAsync(data)

    await prisma.user.update({
      where: { 
        id: userId,
      },
      data: {
        description,
      },
    })
    
    return { 
      success: true,
      message: 'Описание профиля успешно обновлено',
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 

      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }

    console.error('При редактирование описания профиля возникла ошибка: ', error)

    return { 
      success: false,
      error: 'При редактирование описания профиля возникла ошибка',
    }
  }
}