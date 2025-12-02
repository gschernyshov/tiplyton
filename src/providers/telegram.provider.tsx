'use client'

import { useEffect, useState, PropsWithChildren } from 'react'
import { Chip } from "@heroui/chip"
import { useTelegramStore } from '../store/telegram.store'
import Link from 'next/link'

export const TelegramProvider = ({ children }: PropsWithChildren) => {
  const isReady = useTelegramStore((state) => state.isReady)
  const [isError, setError] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        if (process.env.NODE_ENV === 'development') console.log('Импортируем @twa-dev/sdk...')
        const sdk = await import('@twa-dev/sdk')
        if (process.env.NODE_ENV === 'development') console.log('SDK импортирован', sdk)
        if (process.env.NODE_ENV === 'development') console.log('Telegram available:', !!window.Telegram?.WebApp)

        const tg = window.Telegram?.WebApp

        if (!tg) {
          setError(true)
          return
        }

        tg.ready()
        tg.expand()
        tg.setHeaderColor('#fca311')
        tg.setBackgroundColor('#000000')

        let initData: string
        let initDataUnsafe: any

        if (process.env.NODE_ENV === 'development') {
          const mockUser = {
            id: 123456789,
            first_name: 'Мурад',
            last_name: 'Фазимов',
            username: 'muradfazimov2000',
            language_code: 'ru',
            is_bot: false,
            is_premium: true,
          }

          initData = 'user=' + encodeURIComponent(JSON.stringify(mockUser))
          initDataUnsafe = {
            user: mockUser,
            hash: 'mock_hash_1234567890abcdef',
            auth_date: String(Math.floor(Date.now() / 1000)),
          }

          console.debug('Используем мок-данные', initDataUnsafe)
        } else {
          if (!tg.initData || !tg.initDataUnsafe) {
            console.error('Нет данных от Telegram')
            setError(true)
            return
          }
          initData = tg.initData
          initDataUnsafe = tg.initDataUnsafe
        }

        useTelegramStore.getState().setInitData(initData, initDataUnsafe)

        if (initDataUnsafe.user) {
          useTelegramStore.getState().setUser(initDataUnsafe.user)
        }
        if (tg.themeParams) {
          useTelegramStore.getState().setTheme(tg.themeParams)
        }
        
        const onThemeChange = () => {
          useTelegramStore.getState().setTheme(tg.themeParams || {})
        }

        tg.offEvent('themeChanged', onThemeChange)
        tg.onEvent('themeChanged', onThemeChange)

        useTelegramStore.getState().setReady()
      } catch (e) {
        console.error('Ошибка инициализации Telegram WebApp: ', e)
      }
    }

    init()
  }, [])

  if(isError) {
    return (
      <div className="absolute inset-0 flex justify-center items-center h-full w-full px-5 z-50">
        <h1 className="text-sm text-center">
          При загрузке Telegram Mini App<br /> возникла ошибка, попробуйте<br /> 
          <Link 
            href="https://t.me/tiplyton_bot/tiplyton"
            className="text-orange"
          >
            открыть приложение по ссылке.
          </Link>
        </h1>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="absolute inset-0 flex justify-center items-center h-full w-full z-50">
        <Chip 
          color="warning" 
          variant="dot"
        >
          Загрузка Telegram...
        </Chip>
      </div>
    )
  }

  return <>{children}</>
}
