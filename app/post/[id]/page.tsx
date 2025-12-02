'use client'

import { useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Post } from '@/src/components/layout/Post'
import { CardLoading } from '@/src/components/common/Spinner'
import { MessageError } from '@/src/components/common/MessageError'
import { useTonAuthStore } from '@/src/store/ton.store'
import { useTonAuth } from '@/src/hooks/useTonAuth'
import { useGetPost } from '@/src/hooks/useGetPost'

const Page = () => {
  const params = useParams() 
  const id = params.id as string  
  
  const { 
    dataPost, 
    isLoadingPost, 
    error,
  } = useGetPost(id)

  const { isTonAuth } = useTonAuthStore()
  const { connect } = useTonAuth()

  if (isLoadingPost) return <CardLoading label="Загрузка поста" />
  if (error) return <MessageError title="При загрузке поста возникла ошибка" />
  if (!dataPost) return <MessageError title="Пост не найден :(" />

  return (
    <div className="flex flex-col w-full gap-3">
      {!isTonAuth && (
        <div className="flex gap-3 justify-between w-full mb-3">
          <p className="text-sm">
            Для отправки доната <br />подключите кошелёк
          </p>
          <Button 
            size="sm"
            radius="full"
            className="my-1 bg-orange text-black"
            onPress={() => connect()}
          >
            Подключить
          </Button>
        </div>
      )}
      
      <Post post={dataPost} />
    </div>
  )
}

export default Page