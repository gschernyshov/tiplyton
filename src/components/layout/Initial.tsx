'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'

export const Initial = () => {
  const router = useRouter()
  
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-3 bg-black text-center z-50">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">У вас уже есть аккаунт?</h1>
        <p className="text-sm text-default-500">Для использования приложения необходима авторизация.</p>
      </div>
      <div className="flex gap-3">
        <Button 
          color="primary"
          variant="bordered" 
          radius="full" 
          className="border-orange text-orange"
          onPress={() => router.push('/registration')}
        >
          Зарегистрироваться
        </Button>
        <Button 
          color="primary" 
          variant="bordered" 
          radius="full" 
          className="border-orange text-orange"
          onPress={() => router.push('/login')}
        >
          Войти
        </Button>
      </div>
    </div>
  )
}
