'use client'

import { Button } from '@heroui/button'
import { CreatePostForm } from '../../src/forms/create-post'
import { useTonAuthStore } from '../../src/store/ton.store'
import { useTonAuth } from '../../src/hooks/useTonAuth'

const Page = () => {
  const { isTonAuth } = useTonAuthStore()
  const { connect } = useTonAuth()
  
  return (
    <div className="flex flex-col gap-3 w-full">      
      {!isTonAuth && (
        <div className="flex gap-4 justify-between w-full mb-3">
          <p className="text-sm">
            Для создания поста <br />подключите кошелёк
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
      
      <CreatePostForm />
    </div>
  )
}

export default Page
