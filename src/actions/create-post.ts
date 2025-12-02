'use server'

import { auth } from '../auth/auth'
import { createPostSchema } from '../schema/zod'
import { ZodError } from 'zod'
import prisma from '../utils/prisma'

type TCreatePostData = {
  authorAddressWallet: string
  title: string
  content: string
}

type TCreatePostResponse = 
  { 
    success: true
    message: string 
    id: string
  } 
  | 
  { 
    success: false
    error: string
  }

export async function createPost(
  data: TCreatePostData
): Promise<
  TCreatePostResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return { 
        success: false, 
        error: 'При создании поста возникла ошибка: пользователь не авторизован',
      }
    }

    if (!data || !data.title || !data.content || !data.authorAddressWallet) {
      return { 
        success: false, 
        error: 'При создании поста возникла ошибка: присутсвуют пустые поля',
      }
    }

    const dataPost = await createPostSchema.parseAsync(data)

    const post = await prisma.post.create({
      data: {
        ...dataPost,
        authorId: userId,
      },
      select: { 
        id: true,
      },
    })
  
    return { 
      success: true,
      message: 'Новый пост успешно создан',
      ...post,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const messageError = error.issues.map(issue => issue.message).join(", ") 

      return  { 
        success: false,
        error: 'Предупреждение: ' + messageError,
      }
    }
    
    console.error('При создание поста возникли ошибки: ', error)

    return { 
      success: false, 
      error: 'При создание поста возникли ошибки',
    }
  }
}