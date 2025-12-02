'use client'

import { useState, useEffect } from 'react'

const balanceCache = new Map<string, { balance: string; timestamp: number }>()
const CACHE_TTL = 30_000 

export const useTonBalance = (address: string | undefined) => {
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (!address) {
      setBalance(null)
      setError(false)
      setIsLoading(false)
      return
    }

    const now = Date.now()
    const cached = balanceCache.get(address)

    if (cached && now - cached.timestamp < CACHE_TTL) {
      setBalance(cached.balance)
      setError(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(false)

    const controller = new AbortController()

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `https://toncenter.com/api/v2/getAddressBalance?address=${address}`,
          { 
            signal: controller.signal, 
          },
        )

        if (!response.ok) {
          if (response.status === 429) {
            // throw new Error('Слишком много запросов (429)')
            if (cached) {
              setBalance(cached.balance)
              setError(false)
            } else {
              setError(true)
            }
            return
          }
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        if (data.ok && typeof data.result === 'string') {
          const nanoTon = Number(data.result)
          if (isNaN(nanoTon)) {
            throw new Error('Невалидное значение баланса')
          }
          const ton = (nanoTon / 1e9).toFixed(3)

          balanceCache.set(address, { balance: ton, timestamp: now })
          setBalance(ton) 
        } else {
          setError(true)
        }
      } catch (e) {
         if ((e as Error).name === 'AbortError') {
          return
        }
        console.error('При получении баланса возникла ошибка: ', e)
        setError(true)
        setBalance(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()

    return () => {
      controller.abort() 
    }
  }, [address])

  return { 
    balance, 
    isLoading, 
    error,
  }
}
