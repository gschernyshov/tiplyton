'use client'

import { Modal, ModalContent, ModalHeader } from '@heroui/modal'
import { ResetPasswordForm } from '../../forms/reset-password'

interface IProps {
  isOpenModalResetPassword: boolean,
  onOpenChangeResetPassword: () => void
}

export function ResetPassword({isOpenModalResetPassword, onOpenChangeResetPassword} : IProps) {
  return (
    <>
      <Modal 
        placement="bottom"   
        classNames={{
          backdrop: "bg-black/50 backdrop-opacity-70",
          base: "bg-orange text-black",
          header: "py-4",
          body: "w-full py-6",
          closeButton: "hover:bg-white/10 active:bg-white/10",
        }}
        isOpen={isOpenModalResetPassword} 
        onOpenChange={onOpenChangeResetPassword}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Сброс пароля
              </ModalHeader>
              <ResetPasswordForm onClose={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}


