import { TUser } from './user'

export type TPost = {
  id: string
  title: string
  authorId?: string // Поле отображается только на странице поста
  authorAddressWallet?: string // Поле отображается только на странице поста
  content: string
  createdAt: Date
  author: Pick<TUser, 'id' | 'name' | 'username' | 'photoUrl'>
  _count: {
    likes: number
    favorites: number
    donations?: number // Поле отображается только на странице поста
  }
  likedByUser: boolean
  favoritedByUser: boolean
  totalDonations: number
}
