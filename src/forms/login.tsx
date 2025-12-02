'use client'

import { useRef, useState, useEffect } from 'react'
import { useDisclosure } from '@heroui/modal'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { Button } from '@heroui/button'
import { Icon } from '@iconify/react'
import { Alert } from '../components/common/Alert'
import { ResetPassword } from '../components/layout/ResetPassword'
import { useLogin } from '../hooks/useLogin'

export const LoginForm = () => {
  const {
    isOpen: isOpenModalResetPassword, 
    onOpen: onOpenModalResetPassword, 
    onOpenChange: onOpenChangeResetPassword,
  } = useDisclosure()
  const {
    formData, 
    isLoadingLogin, 
    stateError,
    handleChange,
    handleSubmit,
  } = useLogin()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <Form 
        className="flex flex-col gap-5" 
        validationBehavior="native" 
        onSubmit={handleSubmit}
      >
        {stateError.message && 
          <Alert error={stateError.error} message={stateError.message} />}

        <Input
          ref={inputRef}
          isRequired
          isDisabled={isLoadingLogin} 
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
          isDisabled={isLoadingLogin} 
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
          placeholder="Введите свой пароль"
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
        <div className="flex justify-between items-center w-full py-2 px-1">
          <Checkbox 
            isRequired
            defaultSelected 
            size="sm"
          >
            <span className="text-default-600">Запомнить меня</span>
          </Checkbox>
          <Button 
            size="sm"
            variant="light"
            className="data-[pressed=true]:bg-none text-sm text-default-600" 
            onPress={onOpenModalResetPassword}
          >
            Забыли пароль?
          </Button>
        </div>
        
        <Button 
          isLoading={isLoadingLogin}
          isDisabled={isLoadingLogin}
          className="bg-black text-white"
          type="submit"
        >
          {!isLoadingLogin ? 'Войти' : 'Вход...'}
        </Button>
      </Form>

      <ResetPassword 
        isOpenModalResetPassword={isOpenModalResetPassword} 
        onOpenChangeResetPassword={onOpenChangeResetPassword} 
      />
    </>
  )
}
