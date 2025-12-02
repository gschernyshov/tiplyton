'use server'

import { auth } from '../auth/auth'
import prisma from '../utils/prisma'
import { toggleFavoriteSchema } from '../schema/zod'
import { ZodError } from 'zod'

type TToggleFavoriteData = {
  postId: string
}

type TToggleFavoriteResponse = 
  {
    success: true
    favorited: boolean
  }
  |
  {
    success: false
    error: string
  }

export async function toggleFavorite(
  data: TToggleFavoriteData
): Promise<
  TToggleFavoriteResponse
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

    const { postId } = await toggleFavoriteSchema.parseAsync(data)

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_postId: { 
          userId,
          postId,
        }
      }
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { 
          id: existingFavorite.id,
        }
      })
      return { 
        success: true,
        favorited: false 
      }
    } else {
      await prisma.favorite.create({
        data: {
          userId: userId,
          postId,
        }
      })
      return { 
        success: true,
        favorited: true 
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
