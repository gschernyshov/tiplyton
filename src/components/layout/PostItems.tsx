'use client'

import { PostItem } from './PostItem'
import { TPost } from '../../types/post'

interface IProps {
  category: string
  posts: TPost[]
  setPosts: (newPosts: TPost[]) => void
}

export const PostItems = ({ category, posts, setPosts }: IProps) => {

  const deletePostItem = (id: string) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  if (!posts.length) {
    return (
      <p className="text-sm color-white">В этой категории нет постов :(</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map(post => 
        <PostItem 
          key={post.id} 
          category={category}
          post={post} 
          onDeletePostItem={() => deletePostItem(post.id)}
        />)
      }
    </div>
  )
}