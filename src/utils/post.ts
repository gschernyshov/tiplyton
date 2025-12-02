'use server'

import { auth } from '../auth/auth'
import prisma from './prisma'
import { TPost } from '../types/post'

type TGetPostByIdData = {
  postId: string  
}

type TGetPostsData = {
  category: string
  limit: number
  cursor: string | null 
}

type TGetPostByIdDResponse = 
  { 
    success: true
    post: TPost
  } 
  | 
  { 
    success: false
    error: string 
  }

type TGetPostsResponse = 
  { 
    success: true
    posts: TPost[]
    nextCursor: string | null
  }
  | 
  { 
    success: false
    error: string 
  }

export async function getPostById({ 
  postId 
}: TGetPostByIdData): Promise<
  TGetPostByIdDResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return {
        success: false,
        error: 'При загрузке данных поста возникла ошибка: пользователь не авторизован',
      }
    }

    if(!postId) {
      return {
        success: false,
        error: 'При загрузке данных поста возникла ошибка: пост не найден',
      }
    }

    const [post, donationSum] = await Promise.all([
      prisma.post.findUnique({
        where: { 
          id: postId,
        },
        select: {
          id: true,
          authorId: true,
          authorAddressWallet: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              photoUrl: true,
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              favorites: true,
              donations: true,
            },
          },
          likes:{
            where: { 
              userId,
            },
          },
          favorites: {
            where: { 
              userId,
            },
          },
        },
      }),
      prisma.donation.aggregate({
        where: {
          postId,
          status: 'COMPLETED',
        },
        _sum: { 
          amount: true,
        }
      })
    ])

    if (!post) {
      return { 
        success: false,
        error: 'Пост не найден',
      }
    }

    const postsWithStats = {
      ...post,
      likes: undefined,
      favorites: undefined,
      likedByUser: (post.likes.length ?? 0) > 0,
      favoritedByUser: (post.favorites.length ?? 0) > 0,
      totalDonations: donationSum._sum.amount ?? 0,
    }

    return {
      success: true,
      post: postsWithStats,
    }
  } catch (error) {
    console.error('При загрузке данных поста возникла ошибка: ', error)
    
    return {
      success: false,
      error: 'При загрузке данных поста возникла ошибка',
    }
  }
}

export async function getPosts({
  category,
  limit,
  cursor,
}: TGetPostsData): Promise<
  TGetPostsResponse
> {
  try {
    const session = await auth()
    const userId = session?.user.id

    if(!userId) {
      return {
        success: false,
        error: 'При загрузке постов возникла ошибка: пользователь не авторизован',
      }
    }

    let whereClause

    if (category === 'Все') {
      whereClause= {}
    } else if (category === 'Созданные') {
      whereClause = { 
        authorId: userId,
      }
    } else if (category === 'Понравившиеся') {
      whereClause = { 
        likes: { 
          some: { 
            userId,
          },
        },
      }
    } else if (category === 'Избранные') {
      whereClause = { 
        favorites: { 
          some: { 
            userId, 
          }, 
        },
      }
    }

    const [posts, donationSums] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1,       
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        select: {
          id: true,
          authorId: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              photoUrl: true,
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              favorites: true,
            },
          },
          likes:{
            where: { 
              userId,
            },
          },
          favorites: {
            where: { 
              userId,
            },
          },
        }
      }),
      prisma.donation.groupBy({
        by: ['postId'],
        where: { 
          status: 'COMPLETED',
        },
        _sum: { 
          amount: true,
        },
      })
    ])

    let nextCursor = null
    if (posts.length > limit) {
      const nextItem = posts.pop() 
      nextCursor = nextItem?.id || null
    }

    const donationMap = donationSums.reduce((acc, item) => {
      acc[item.postId] = item._sum.amount || 0
      return acc
    }, {} as Record<string, number>)

    const postsWithStats = posts.map(post => ({
      ...post,
      likes: undefined,
      favorites: undefined,
      totalDonations: donationMap[post.id] ?? 0,
      likedByUser: (post.likes.length ?? 0) > 0,
      favoritedByUser: (post.favorites.length ?? 0) > 0,
    }))

    return { 
      success: true,
      posts: postsWithStats,
      nextCursor,
    }
  } catch (error) {
    console.error('При загрузке постов возникла ошибка: ', error)
    
    return {
      success: false,
      error: 'При загрузке постов возникла ошибка',
    }
  }
}
