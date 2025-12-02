'use client'

import { usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@heroui/spinner'
import { Initial } from '../components/layout/Initial'
import { useAuthStore } from '../store/auth.store'
import { useTonAuth } from '../hooks/useTonAuth'
import { useLoadingUser } from '../hooks/useLoadingUser'

interface IProps {
  children: ReactNode
}

export const AppLoader = ({ children }: IProps) => {
  const pathname = usePathname()
  const { status: authStatus, data: session } = useSession()
  const { isAuth, status, setAuthState } = useAuthStore()

  useLoadingUser()
  useTonAuth()

  useEffect(() => {
    setAuthState(authStatus, session ?? null)
  }, [authStatus, session, setAuthState])

  if (!isAuth && pathname !== '/registration' && pathname !== '/login') {
    return <Initial />
  }

  return (
    <>
      {((status === 'loading') || (isAuth &&  (pathname === '/' || pathname === '/registration' || pathname === '/login'))) && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <Spinner color="warning" size="lg" />
        </div>
      )}
      {children}
    </>
  )
}
