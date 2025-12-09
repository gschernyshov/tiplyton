'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  useTonConnectUI,
  useTonWallet,
  useIsConnectionRestored,
} from '@tonconnect/ui-react'
import { useTonAuthStore } from '@/src/store/ton.store'

export const useTonAuth = () => {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const isConnectionRestored = useIsConnectionRestored()
  const status = useTonAuthStore(state => state.status)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(() => {
    setError(null)
    tonConnectUI.openModal()
  }, [tonConnectUI])

  const disconnect = useCallback(() => {
    setError(null)
    tonConnectUI.disconnect()
    useTonAuthStore.getState().setTonAuthState('unauthenticated', null)
  }, [tonConnectUI])

  useEffect(() => {
    if (!isConnectionRestored || !wallet) return
    if (status === 'authenticated') return

    useTonAuthStore.getState().setTonAuthState('authenticated', {
      address: wallet?.account.address,
      publicKey: wallet?.account.publicKey ?? null,
      name: 'name' in wallet && typeof wallet.name === 'string' ? wallet.name : null,
      imageUrl: 'imageUrl' in wallet && typeof wallet.imageUrl === 'string' ? wallet.imageUrl : null,
      chain: wallet?.account.chain,
      platform: wallet?.device.platform,
    })
    
  }, [isConnectionRestored, wallet, status])

  useEffect(() => {
    if (!tonConnectUI) return

    const unsub = tonConnectUI.onStatusChange((w) => {
      if (w) {
        useTonAuthStore.getState().setTonAuthState('authenticated', {
          address: w.account.address,
          publicKey: w.account.publicKey ?? null,
          name: w.name ?? null,
          imageUrl: w.imageUrl ?? null,
          chain: w.account.chain,
          platform: w.device.platform,
        })
      } else {
        useTonAuthStore.getState().setTonAuthState('unauthenticated', null)
      }
    })

    return () => unsub()
  }, [tonConnectUI])

  return {    
    error,       
    wallet,      
    connect,    
    disconnect,  
    reconnect: disconnect,
  }
}
