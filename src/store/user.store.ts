import { create } from 'zustand'
import { TUser } from '../types/user'

interface AuthState {
  dataUser: TUser | null
  cash: {ttl: number; timestamp: number} | null
  setDataUser: (user: TUser) => void
  updateDataUser: (description : string) => void
  clearDataUser: () => void
  isCacheValid: () => boolean
}

export const useUserStore = create<AuthState>((set, get) => ({
  dataUser: null,
  cash: null,

  setDataUser: (user: TUser) =>
    set({
      dataUser: user, 
      cash: {
        ttl: 5*60*1000, 
        timestamp: Date.now()}
    }),

  updateDataUser: (description: string) =>
    set((state) => ({
      dataUser: state.dataUser
        ? { ...state.dataUser, description }
        : null,
      cash: state.cash
        ? { ...state.cash, timestamp: Date.now() }
        : null,
    })),

  clearDataUser: () => 
    set({
      dataUser: null, 
      cash: null
    }),

  isCacheValid: () => {
    const { cash } = get()
    if (!cash) return false
    return Date.now() - cash.timestamp < cash.ttl
  },
}))