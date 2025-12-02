'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { UserSection }  from '../../src/components/layout/UserSection'
import { UserPosts } from '../../src/components/layout/UserPosts'
import { UserWalletInfo } from '../../src/components/layout/UserWalletInfo'
import { useAuthStore } from '../../src/store/auth.store'
import { useUserStore } from '../../src/store/user.store'

const Page = () => {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const isAuth = useAuthStore((state) => state.isAuth)
  const dataUser = useUserStore(state => state.dataUser)
  
  useEffect(() => {
    if (!isAuth) {
      router.push('/')
    }
  }, [isAuth, router])

  if (status === 'loading' || !isAuth || !dataUser) {
    return (
      <Card className="w-full space-y-5 p-4 bg-orange" radius="lg">
        <Skeleton className="rounded-lg bg-white/30">
          <div className="h-65 rounded-lg bg-white/30" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg bg-white/30">
            <div className="h-15 w-3/5 rounded-lg bg-white/30" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg bg-white/30">
            <div className="h-15 w-4/5 rounded-lg bg-orange/20" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg bg-white/30">
            <div className="h-15 w-2/5 rounded-lg bg-orange/30" />
          </Skeleton>
        </div>
      </Card>
    )
  }
  
  if (dataUser.status === 'BANNED') {
    return (
      <p>Ваш аккаунт забанен</p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <UserSection />
      <UserPosts />
      <UserWalletInfo />
    </div>
  )
}

export default Page
