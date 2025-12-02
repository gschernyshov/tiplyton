'use client'

import { Button } from '@heroui/button'
import { PostItems } from '../../src/components/layout/PostItems'
import { CardLoading } from '../../src/components/common/Spinner'
import { MessageError } from '../../src/components/common/MessageError'
import { useGetPosts } from '../../src/hooks/useGetPosts'

const Page = () => { 
  const {
    categoryPosts,
    dataPosts,
    isLoadingPosts,
    isLoadingMorePosts, 
    error,      
    nextCursor,
    setDataPosts,
    loadMorePosts,   
  } = useGetPosts('Все', 10)

  if (isLoadingPosts) return <CardLoading label="Загрузка постов" />
  if (error) return <MessageError title="При загрузке постов возникла ошибка :(" />
  if (!dataPosts) return <MessageError title="Постов пока нет :(" />

  return (
    <>
      <PostItems 
        category={categoryPosts} 
        posts={dataPosts} 
        setPosts={setDataPosts} 
      />
      
      {nextCursor && (
        <div className="flex justify-center p-3">
          <Button
            isLoading={isLoadingMorePosts}
            isDisabled={isLoadingMorePosts}
            radius="full"
            className="bg-orange text-black"
            onPress={loadMorePosts}
          >
            {!isLoadingMorePosts ? 'Показать ещё' : 'Загрузить ещё...'}
          </Button>
        </div>
      )}
    </>
  )
}

export default Page
