'use client'

import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { Address, toNano } from 'ton'
import { useAuthStore } from '../store/auth.store'
import { useTonAuthStore } from '../store/ton.store'
import { TStateError } from '../types/form'

interface IProps {
  postId: string
  authorId: string
  authorAddressWallet: string
  setCountDonations: Dispatch<SetStateAction<number>>
  setTotalDonations: Dispatch<SetStateAction<number>>
}

const pollForConfirmation = async (
  amount: number,
  donationId: string,
  fromAddressWallet: string,
  toAddressWallet: string,
): Promise<
  boolean
> => {
  const maxAttempts = 7
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const result = await fetch('/api/ton/donations/confirm', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          amount,
          donationId,
          fromAddressWallet,
          toAddressWallet,
        }),
      })

      const data = await result.json()

      if (data.success && data.status === 'COMPLETED') {
        return true
      }
    } catch (e) {
      console.error('Ошибка при подтверждении доната:', e)
    }

    await new Promise(resolve => setTimeout(resolve, 3000))
    attempts++
  }

  return false
}

export const useDonate = ({
  postId, 
  authorId, 
  authorAddressWallet,
  setCountDonations,
  setTotalDonations,
}: IProps) => {
  const [tonConnectUI] = useTonConnectUI()
  const session = useAuthStore(state => state.session)
  const wallet = useTonAuthStore(state => state.wallet)
  const userId: string | undefined = session?.user.id
  const [amount, setAmount] = useState<number>(0)
  const [isLoadingDonation, setIsLoadingDonation] = useState<boolean>(false)
  const [stateError, setStateError] = useState<TStateError>({
    error: false,
    message: '',
  })

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setAmount(Number(value))
    setStateError({ error: false, message: '' })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) {
      setStateError({ error: true, message: 'При отправке доната возникла ошибка: кошелек не подключен' })
      return;
    }

    if (amount <= 0) {
      setStateError({error: true, message: 'При отправке доната возникла ошибка: сумма доната должна быть больше 0' })
      return
    }

    let donationId

    setIsLoadingDonation(true)
    try {
      const resultCreateDonate = await fetch('/api/ton/donations/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          fromUserId: userId, 
          fromUserAddressWallet: wallet.address,
          toUserId: authorId, 
          toUserAddressWallet: authorAddressWallet,
          postId,
        }),
      })

      if (!resultCreateDonate.ok) throw new Error('при создание доната возникла ошибка')
      
      const dataCreateDonate = await resultCreateDonate.json()

      if (dataCreateDonate.success) {
        donationId = dataCreateDonate.donationId

        let parsedAddress: Address
        try {
          parsedAddress = Address.parse(authorAddressWallet)
        } catch {
          throw new Error('невалидный адрес кошелька автора поста')
        }

        await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              address: parsedAddress.toString(),
              amount: toNano(amount).toString(),
            },
          ],
        })

        const resultConfirmDonate = await fetch('/api/ton/donations/confirm', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount,
            donationId: donationId,
            fromAddressWallet: wallet.address,
            toAddressWallet: authorAddressWallet,
          }),
        })

        if (!resultConfirmDonate.ok) throw new Error('при обработке статуса доната возникла ошибка')
        
        const dataConfirmDonate = await resultConfirmDonate.json()
        
        if (dataConfirmDonate.success) {
          if (dataConfirmDonate.status === 'COMPLETED') {
            setAmount(0)
            setCountDonations((prev: number) => prev + 1)
            setTotalDonations((prev: number) => prev + amount)
            setStateError({ error: false, message: 'Донат отправлен!' })

            setTimeout(() => {
              setStateError({ error: false, message: '' })
            }, 2000)
          } else {
            const isConfirmed = await pollForConfirmation(amount, donationId, wallet.address, authorAddressWallet)

            if (isConfirmed) {
              setAmount(0)
              setCountDonations((prev: number) => prev + 1)
              setTotalDonations((prev: number) => prev + amount)  
              setStateError({ error: false, message: 'Донат отправлен!' })

              setTimeout(() => {
                setStateError({ error: false, message: '' })
              }, 3000)
            } else {
              throw new Error('при повторной обработке статуса доната возникла ошибка')
            }
          }
        } else {
          await fetch('/api/ton/donations/delete', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              donationId: donationId,
            }),
          })
        }
      }
    } catch (e) {
      console.error('При отправке доната возникла ошибка: ', e)

      if (donationId) {
        await fetch('/api/ton/donations/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donationId }),
        })
      }
      
      setStateError({error: true, message: 'При отправке доната возникла ошибка' })
    } finally {
      setIsLoadingDonation(false)
    }
  }, [
    wallet,
    amount,
    authorAddressWallet,
    postId,
    userId,
    authorId,
    tonConnectUI,
    setCountDonations,
    setTotalDonations,
  ])

  return {
    amount,
    isLoadingDonation,
    stateError,
    handleChange,
    handleSubmit,
  }
}
