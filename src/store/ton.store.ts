import { create } from 'zustand'

type TonAuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface TonWallet {
  address: string
  publicKey: string | null
  name: string | null
  imageUrl: string | null
  chain: string
  platform: string | null
}

interface AuthState {
  isTonAuth: boolean 
  status: TonAuthStatus
  wallet: TonWallet | null
  setTonAuthState: (status: TonAuthStatus, wallet: TonWallet | null) => void
}

export const useTonAuthStore = create<AuthState>((set) => ({
  isTonAuth: false,
  status: 'loading',
  wallet: null,
  setTonAuthState: (status, wallet) =>
    set({
      isTonAuth: status === 'authenticated',
      status,
      wallet,
    }),
}))