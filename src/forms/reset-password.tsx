'use client'

import { useRef, useEffect } from 'react'
import { Form } from '@heroui/form'
import { ModalBody } from '@heroui/modal'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { MailIcon } from '../assets/icons/mail-icon'
import { Alert } from '../components/common/Alert'
import { useResetPasswordForm } from '../hooks/useResetPassword'

interface IProps {
  onClose: () => void
}

export const ResetPasswordForm = ({ onClose }: IProps) => {
  const {  
    isResetPassword,
    email,
    isLoadingResetPassword, 
    stateError, 
    handleChange, 
    handleSubmit,
  } = useResetPasswordForm()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Form 
      className="w-full" 
      validationBehavior="native" 
      onSubmit={handleSubmit}
    >   
      <ModalBody>
        <Input
          ref={inputRef}
          isRequired
          isDisabled={isLoadingResetPassword || isResetPassword}
          endContent={
            <MailIcon 
              className="text-2xl text-black pointer-events-none shrink-0" 
            />
          }
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Введите свой Email"
          value={email}
          type="email"
          variant="bordered"
          size="lg"
          classNames={{
            label: "!text-black",
            inputWrapper: 'border-black data-[hover=true]:border-black',
            input: 'text-black placeholder:text-default-600',
          }}

          onChange={handleChange}
        />

        {stateError.message &&
          <Alert error={stateError.error} message={stateError.message} />}

        <div className="flex justify-end gap-2 py-4">
          <Button
            isDisabled={isLoadingResetPassword} 
            variant="light"
            className="text-sm text-default-600"
            onPress={onClose}
          >
            {!isResetPassword ? 'Отмена' : 'Войти'}
          </Button>
          <Button  
            isDisabled={isLoadingResetPassword || isResetPassword}
            isLoading={isLoadingResetPassword}
            className="bg-black text-white"
            type="submit"
          >
            {!isLoadingResetPassword ? 'Сбросить' : 'Сброс...'}
          </Button>
        </div>
      </ModalBody>
    </Form>
  )
}


