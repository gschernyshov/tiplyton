import { create } from 'zustand'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

interface TelegramState {
  telegramUser: TelegramUser | null
  initData: string | null
  initDataUnsafe: Record<string, any> | null
  theme: Record<string, string>

  isInitialized: boolean
  isReady: boolean

  setInitData: (data: string, dataUnsafe: any) => void
  setUser: (user: TelegramUser | null) => void
  setTheme: (theme: Record<string, string>) => void
  setReady: () => void
}

export const useTelegramStore = create<TelegramState>((set) => ({
  telegramUser: null,
  initData: null,
  initDataUnsafe: null,
  theme: {},

  isInitialized: false,
  isReady: false,

  setInitData: (initData, initDataUnsafe) => 
    set({ initData, initDataUnsafe, isInitialized: true }),

  setUser: (telegramUser) => set({ telegramUser }),

  setTheme: (theme) => set({ theme }),

  setReady: () => set({ isReady: true }),
}))
