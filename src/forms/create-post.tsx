'use client'

import { useRef, useEffect } from 'react'
import { Form } from '@heroui/form'
import { Avatar } from '@heroui/avatar'
import { Input, Textarea } from '@heroui/input'
import { Button } from '@heroui/button'
import { Alert } from '../components/common/Alert'
import { useUserStore } from '../store/user.store'
import { useTonAuthStore } from '../store/ton.store'
import { useCreatePost } from '../hooks/useCreatePost'

export const CreatePostForm = () => {
  const isTonAuth = useTonAuthStore(state => state.isTonAuth)
  const dataUser = useUserStore(state => state.dataUser)
  const {
    formData,
    isLoadingCreatePost,
    stateError, 
    handleChange, 
    handleSubmit,
  } = useCreatePost()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus() 
    }
  }, [])
  
  return (
    <Form 
      className="form-create-post flex flex-col gap-5 p-3 bg-orange shadow shadow-md shadow-white/20 rounded-2xl" 
      validationBehavior="native" 
      onSubmit={handleSubmit}
    >
      <div className="flex gap-3">
        <Avatar
          isBordered={false}
          classNames={{
            base: "border border-black border-3",
          }}
          radius="full"
          size="lg"
          src={dataUser?.photoUrl}
        />
        <div className="flex flex-col justify-center items-start gap-1">
          <h4 className="text-small font-semibold leading-none text-black">{dataUser?.name}</h4>
          <h5 className="text-small tracking-tight text-default-700">{dataUser?.username}</h5>
        </div>
      </div>

      {stateError.message && 
        <Alert error={stateError.error} message={stateError.message} />}
      
      <Input
        ref={inputRef}
        isRequired
        isDisabled={isLoadingCreatePost || !isTonAuth} 
        label="Заголовок"
        labelPlacement="outside"
        name="title"
        placeholder="Введите заголовок"
        value={formData.title}
        type="text"
        variant="bordered"
        classNames={{
          label: "!text-black",
          inputWrapper: "border-black data-[hover=true]:border-black",
          input: "border-black text-black placeholder:text-default-600", 
        }}
        className='border-orange'
        onChange={handleChange}
      />

      <Textarea 
        isRequired
        isDisabled={isLoadingCreatePost || !isTonAuth} 
        label="Описание" 
        labelPlacement="outside"
        name="content"
        placeholder="Введите своё описание" 
        value={formData.content} 
        variant="bordered"
        className="w-full" 
        classNames={{
          label: "!text-black",
          inputWrapper: "border-black data-[hover=true]:border-black",
          input: "border-black text-black placeholder:text-default-600", 
        }}
        onChange={handleChange}
      />

      <Button
        isLoading={isLoadingCreatePost}
        isDisabled={isLoadingCreatePost || !isTonAuth}
        radius="full"
        size="sm"
        className="bg-black text-white"
        type="submit"
      >
        {!isLoadingCreatePost ? 
          "Создать пост" : "Создание..."}
      </Button>
   </Form>
  )
}
