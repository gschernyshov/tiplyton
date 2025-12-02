'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Form } from '@heroui/form'
import { Avatar } from '@heroui/avatar'
import { Input } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { Button } from '@heroui/button'
import { Icon } from '@iconify/react'
import { Alert } from '../components/common/Alert'
import { useRegistration } from '../hooks/useRegistration'

export const RegistrationForm = () => {
  const {
    formData,
    isLoadingRegistration,
    stateError,
    handleChange,
    handleSubmit,
  } = useRegistration()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <Form 
      className="flex flex-col gap-5" 
      validationBehavior="native" 
      onSubmit={handleSubmit}
    >
      <div className="flex gap-3 pb-2">
        <Avatar
          isBordered={false}
          classNames={{
            base: "border border-black border-3",
          }}
          radius="full"
          size="lg"
          src={formData.photoUrl}
        />
        <div className="flex flex-col justify-center items-start gap-1">
          <h4 className="text-md font-semibold leading-none text-black">{formData.name}</h4>
          <h5 className="text-small tracking-tight text-default-700">{formData.username}</h5>
        </div>
      </div>
      <Input
        ref={inputRef}
        isRequired
        isDisabled={isLoadingRegistration}
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Введите свой Email"
        value={formData.email}
        type="email"
        variant="bordered"
        classNames={{
          label: "!text-black",
          inputWrapper: 'border-black data-[hover=true]:border-black',
          input: 'text-black placeholder:text-default-600',
        }}
        onChange={handleChange}
      />
      <Input
        isRequired
        isDisabled={isLoadingRegistration}
        endContent={
          <button type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <Icon
                className="text-black text-2xl pointer-events-none"
                icon="solar:eye-closed-linear"
              />
            ) : (
              <Icon
                className="text-black text-2xl pointer-events-none"
                icon="solar:eye-bold"
              />
            )}
          </button>
        }
        label="Пароль"
        labelPlacement="outside"
        name="password"
        placeholder="Введите пароль"
        value={formData.password}
        type={isVisible ? "text" : "password"}
        variant="bordered"
        classNames={{
          label: "!text-black",
          inputWrapper: 'border-black data-[hover=true]:border-black',
          input: 'text-black placeholder:text-default-600',
        }}
        onChange={handleChange}
      />
      <Input
        isRequired
        isDisabled={isLoadingRegistration}
        endContent={
          <button type="button" onClick={toggleConfirmVisibility}>
            {isConfirmVisible ? (
              <Icon
                className="text-black text-2xl pointer-events-none"
                icon="solar:eye-closed-linear"
              />
            ) : (
              <Icon
                className="text-black text-2xl pointer-events-none"
                icon="solar:eye-bold"
              />
            )}
          </button>
        }
        label="Повторный пароль"
        labelPlacement="outside"
        name="confirmPassword"
        placeholder="Повторите пароль"
        type={isConfirmVisible ? "text" : "password"}
        variant="bordered"
        classNames={{
          label: "!text-black",
          inputWrapper: 'border-black data-[hover=true]:border-black',
          input: 'text-black placeholder:text-default-600',
        }}
        onChange={handleChange}
      />
      <Checkbox 
        isRequired
        defaultSelected 
        size="sm"
        className="py-4 text-black"
      >
        <span className="text-default-600">Вы даёте согласие с&nbsp;</span>
        <Link className="relative z-1 text-black" href="/documents/document/pdf">
          Условиями
        </Link>
        <span className="text-default-600">&nbsp; и&nbsp;</span>
        <Link className="relative z-1 text-black " href="/documents/document/pdf">
          Политикой конфиденциальности
        </Link>
        <span className="text-default-600">.</span>
      </Checkbox>

      {stateError.message && 
        <Alert error={stateError.error} message={stateError.message} />}

      <Button 
        isLoading={isLoadingRegistration}
        isDisabled={isLoadingRegistration}
        className="bg-black text-white"
        type="submit"
      >
        {!isLoadingRegistration ? 'Зарегистрироваться' : 'Регистрация...'}
      </Button>
    </Form>
  )
}

