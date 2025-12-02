'use client'

import { Button } from '@heroui/button'
import { PostItems } from './PostItems'
import { useGetPosts } from '../../hooks/useGetPosts'

export const UserPosts = () => {
  const {
    categoryPosts,
    dataPosts,
    isLoadingPosts,
    isLoadingMorePosts, 
    error,      
    nextCursor,
    setCategoryPosts,
    setDataPosts,
    loadMorePosts,   
  } = useGetPosts('', 10)

  const buttons = [
    {
      title: 'Созданные',
    },
    {
      title: 'Понравившиеся',
    },
    {
      title: 'Избранные',
    }
  ]

  const handleGetPostsByCategory = (newCategoryPosts: string) => {
    if (newCategoryPosts === categoryPosts) {
      setCategoryPosts('')
      return
    }
    setCategoryPosts(newCategoryPosts)
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Посты</h2>
      <div className="flex flex-wrap gap-3">
        {buttons.map(button => (
          <Button
            key={button.title}
            isLoading={(categoryPosts === button.title) && isLoadingPosts}
            isDisabled={isLoadingPosts}
            radius="full"
            size="sm"
            variant={categoryPosts === button.title  ? 'solid' : 'bordered'}
            className={categoryPosts === button.title ? 'bg-orange text-black' : 'border-orange text-white'}
            onPress={() => handleGetPostsByCategory(button.title)}
          >
            {button.title}
          </Button>
        ))}
      </div>

      {categoryPosts && (
        <>
          {!isLoadingPosts && error && (
            <p>{error}</p>
          )}
          {!isLoadingPosts && !error && !dataPosts && (
            <p className="text-sm color-white">В этой категории нет постов :(</p>
          )}
          {!isLoadingPosts && !error && dataPosts && dataPosts.length === 0 && (
            <p className="text-sm color-white">В этой категории нет постов :(</p>
          )}
          {!isLoadingPosts && !error && dataPosts && dataPosts.length > 0 && (
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
                    size="sm"
                    className="bg-orange text-black"
                    onPress={loadMorePosts}
                  >
                    {!isLoadingMorePosts ? 'Показать ещё' : 'Загрузка...'}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}