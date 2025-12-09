'use client'

import { useUserStore } from '../../store/user.store'

export const Header = () => {
  const dataUser = useUserStore((state) => state.dataUser)
  const username = dataUser?.username

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) return 'Доброго тебе утра'
    if (hour >= 12 && hour < 18) return 'Доброго тебе дня'
    if (hour >= 18 && hour < 23) return 'Доброго тебе вечера'
    return 'Доброй тебе ночи'
  }

  const greeting = getGreeting()

  return (
    <div className="flex flex-col gap-1 pt-10 pb-7">
      <p className="text-md text-default-500">{username ? `Привет, ${username}!` : `Привет!`}</p>
      <h2 className="text-4xl">{greeting}!</h2>
    </div>
  )
}
