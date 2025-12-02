'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '../../store/user.store'

export const Header = () => {
  const dataUser = useUserStore((state) => state.dataUser)
  const username = dataUser?.username
  const [greeting, setGreeting] = useState('Привет!')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting('Доброго тебе утра')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Доброго тебе дня')
    } else if (hour >= 18 && hour < 23) {
      setGreeting('Доброго тебе вечера')
    } else {
      setGreeting('Доброй тебе ночи')
    }
  }, [])

  return (
    <div className="flex flex-col gap-1 pt-10 pb-7">
      <p className="text-md text-default-500">{username ? `Привет, ${username}!` : `Привет!`}</p>
      <h2 className="text-4xl">{greeting}!</h2>
    </div>
  )
}
