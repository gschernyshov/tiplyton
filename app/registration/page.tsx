'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RegistrationForm } from '../../src/forms/registration'
import { useAuthStore } from '../../src/store/auth.store'

const Page = () => {
  const router = useRouter()
  const isAuth = useAuthStore((state) => state.isAuth)
  
  useEffect(() => {
    if (isAuth) {
      router.push('/profile')
    }
  }, [isAuth, router])

  return (
    <div className="flex justify-center items-center w-full text-black">
      <div className="flex flex-col gap-4 w-full max-w-md py-4 px-4 bg-orange rounded-4xl">
        <p className="pb-4 text-3xl text-left font-semibold">
          Регистрация
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>

        <RegistrationForm />
        
        <p className="text-small text-center">
          <Link className="text-default-700" href="/login">
            У вас уже есть аккаунт? Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Page