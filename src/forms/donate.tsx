'use client'

import { Dispatch, SetStateAction } from 'react'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Alert } from '../components/common/Alert'
import { useTonAuthStore } from '../store/ton.store'
import { useDonate } from '../hooks/useDonate'

interface IProps {
  postId: string
  authorId: string
  authorAddressWallet: string
  setCountDonations: Dispatch<SetStateAction<number>>
  setTotalDonations: Dispatch<SetStateAction<number>>
}

export const DonateForm = ({ 
  postId, 
  authorId, 
  authorAddressWallet, 
  setCountDonations, 
  setTotalDonations 
}: IProps) => {
  const isTonAuth = useTonAuthStore(state => state.isTonAuth)
  const {
    amount,
    isLoadingDonation,
    stateError,
    handleChange,
    handleSubmit,
  } = useDonate({
    postId, 
    authorId, 
    authorAddressWallet, 
    setCountDonations, 
    setTotalDonations,
  })

  return (
    <Form 
      className="flex gap-2 p-3 bg-orange shadow-md shadow-white/20 rounded-2xl" 
      validationBehavior="native" 
      onSubmit={handleSubmit}
    >
      {stateError.message && 
        <Alert error={stateError.error} message={stateError.message} />}
      
      <Input
        isRequired
        isDisabled={isLoadingDonation || !isTonAuth} 
        label="Сумма доната"
        labelPlacement="outside"
        name="amount"
        placeholder="Введите сумму доната"
        value={String(amount)}
        type="number"
        variant="bordered"
        classNames={{
          label: "!text-black",
          inputWrapper: "border-black data-[hover=true]:border-black",
          input: "border-black text-black placeholder:text-default-600", 
        }}
        className='border-orange'
        onChange={handleChange}
      />

      <Button
        isLoading={isLoadingDonation}
        isDisabled={isLoadingDonation || !isTonAuth}
        radius="full"
        size="sm"
        className="bg-black text-white"
        type="submit"
      >
        {!isLoadingDonation ? 
          "Задонатить" : "Отправка..."}
      </Button>
   </Form>
  )
}