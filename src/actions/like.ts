'use server'

import { auth } from '../auth/auth'
import prisma from '../utils/prisma'
import { toggleLikeSchema } from '../schema/zod'
import { ZodError } from 'zod'

type TToggleLikeData = {
  postId: string,
}

type TToggleLikeResponse = 
  {
    success: true
    isLiked: boolean
  }
  |
  {
    success: false
    error: string
  }

export async function toggleLike(
  data: TToggleLikeData
): Promise<
  TToggleLikeResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return {
        success: false,
        error: 'При запросе возникла ошибка: пользователь не авторизован',
      }
    }

    if (!data || !data.postId) {
      return { 
        success: false, 
        error: 'При запросе возникла ошибка: присутсвуют пустые поля',
      }
    }

    const { postId } = await toggleLikeSchema.parseAsync(data)

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { 
          userId,
          postId,
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { 
          id: existingLike.id,
        }
      })
      return { 
        success: true,
        isLiked: false 
      }
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        }
      })
      return { 
        success: true,
        isLiked: true 
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 

      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }

    return { 
      success: false, 
      error: 'При запросе возникла ошибка',
    }
  }
}
