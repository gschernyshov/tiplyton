'use server'

import { auth } from '../auth/auth'
import prisma from '../utils/prisma'
import { deletePostSchema } from '../schema/zod'
import { ZodError } from 'zod'

type TDeleteAccountData = {
  postId: string
}

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

export async function deletePost(
  data: TDeleteAccountData
): Promise<
  TDeleteAccountResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return { 
        success: false, 
        error: 'При удалении поста возникла ошибка: пользователь не авторизован',
      }
    }

    if (!data || !data.postId) {
      return { 
        success: false, 
        error: 'При удалении поста возникла ошибка: присутсвуют пустые поля',
      }
    }

    const { postId } = await deletePostSchema.parseAsync(data)

    await prisma.post.delete({
      where: { 
        id: postId,
      },
    })
  
    return { 
      success: true,
      message: 'Пост успешно удалён',
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 

      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }
    
    console.error('При удалении поста возникла ошибка: ', error)

    return { 
      success: false, 
      error: 'При удалении поста возникла ошибка',
    }
  }
}