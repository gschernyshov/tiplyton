import { create } from 'zustand'
import { 
  TelegramUser,
  TelegramInitDataUnsafe, 
  TelegramThemeParams,  
} from '../types/telegram'

interface TelegramState {
  telegramUser: TelegramUser | null
  initData: string | null
  initDataUnsafe: TelegramInitDataUnsafe | null
  theme: TelegramThemeParams

  isInitialized: boolean
  isReady: boolean

  setInitData: (data: string, dataUnsafe: TelegramInitDataUnsafe) => void
  setUser: (user: TelegramUser | null) => void
  setTheme: (theme: TelegramThemeParams) => void
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
