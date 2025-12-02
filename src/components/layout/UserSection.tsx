'use client'

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Textarea } from '@heroui/input'
import { Alert } from '../common/Alert'
import { useUserStore } from '../../store/user.store'
import { useUpdateProfileDescription } from '../../hooks/useUpdateProfileDescription'
import { useSignOut } from '../../hooks/useSignOut'
import { useDeleteProfile } from '../../hooks/useDeleteProfile'

export const UserSection = () => {
  const dataUser = useUserStore(state => state.dataUser)
  const {
    onOpenFormEditDescriptionUser,
    onCloseFormEditDescriptionUser,
    editDescriptionUser,
    stateError,
    handleChangeDescriptionUser,
    handleEditDescriptionUser, 
  } = useUpdateProfileDescription()
  const {
    isLoadingSignOut,
    handleSignOut,
  } = useSignOut()
  const {
    isLoadingDeleteProfile,
    handleDeleteAccount,
  } = useDeleteProfile()

  const isLoading = isLoadingSignOut || isLoadingDeleteProfile

  return (
    <div className="flex flex-col gap-5">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Card className="bg-orange shadow shadow-md shadow-white/20">
          <CardHeader className="justify-between gap-1">
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
                <h4 className="text-small font-semibold leading-none text-black">{dataUser?.name || 'Не указано'}</h4>
                <h5 className="text-small tracking-tight text-default-700">{dataUser?.email}</h5>
              </div>
            </div>
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              radius="full"
              size="sm"
              variant="bordered"
              className="text-black border-black"
              onPress={handleSignOut}
            >
              Выйти
            </Button>
          </CardHeader>
          <CardBody className="text-small text-black">
            {!editDescriptionUser.state ? (
              <p>
                {dataUser?.description || 'Описание анкеты не указано'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">

                {stateError.message && <Alert error={stateError.error} message={stateError.message} />}
                
                <Textarea 
                  isDisabled={editDescriptionUser.isLoading} 
                  className="w-full" 
                  classNames={{
                    label: "!text-black",
                    inputWrapper: 'border-black data-[hover=true]:border-black',
                    input: "border-black text-black placeholder:text-default-600", 
                  }}
                  variant="bordered"
                  label="Описание" 
                  value={editDescriptionUser.value} 
                  placeholder="Введите своё описание" 
                  onChange={handleChangeDescriptionUser}
                />
              </div>
            )}
          </CardBody>

          <CardFooter className="gap-3">
            {!editDescriptionUser.state ? (
              <>
                <Button
                  radius="full"
                  size="sm"
                  className="bg-black text-white"
                  onPress={onOpenFormEditDescriptionUser}
                >
                  Обновить данные
                </Button>
                <Popover placement="left">
                  <PopoverTrigger>
                    <Button
                      isDisabled={isLoading}
                      radius="full"
                      size="sm"
                      className="bg-gray text-black"
                    >
                     Удалить аккаунт
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="items-start gap-2 p-3 bg-black">
                    <h3 className="text-small">Вы уверены, что хотите<br />удалить профиль?</h3>
                    <Button
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      size="sm"
                      className="bg-orange"
                      onPress={handleDeleteAccount}
                    >
                      {!isLoading ? "Удалить" : "Удаление..."}
                    </Button>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <Button
                  key="bg-black text-white"
                  isLoading={editDescriptionUser.isLoading}
                  isDisabled={editDescriptionUser.isLoading}
                  radius="full"
                  size="sm"
                  className="bg-black text-white"
                  onPress={handleEditDescriptionUser}
                >
                  {!editDescriptionUser.isLoading ? "Сохранить изменения" : "Сохранение..."}
                </Button>
                <Button
                  key="bg-gray text-black"
                  radius="full"
                  size="sm"
                  className="bg-gray text-black"
                  onPress={onCloseFormEditDescriptionUser}
                >
                  Отмена
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
