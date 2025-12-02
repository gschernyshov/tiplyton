'use client'

import Image from 'next/image'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Snippet } from '@heroui/snippet'
import { Icon } from '@iconify/react'
import { useTonAuthStore } from '../../store/ton.store'
import { useTonAuth } from '../../hooks/useTonAuth'
import { useTonBalance } from '../../hooks/useTonBalance'
import { siteConfig } from '../../config/site.config'

export const UserWalletInfo = () => {
  const { infoWallet } = siteConfig.ton
  const { connect } = useTonAuth()
  const { disconnect } = useTonAuth()
  const wallet = useTonAuthStore(state => state.wallet)
  const { isLoading, balance, error } = useTonBalance(wallet?.address)
  
   if (!wallet) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-lg font-bold">Информация о твоём кошельке</h2>
        <div className="flex gap-3 justify-between w-full">
          <p className="text-sm">
            Для получения информации<br />подключите кошелёк
          </p>
          <Button 
            radius="full"
            size="sm"
            className="my-1 bg-orange text-black"
            onPress={() => connect()}
          >
            Подключить
          </Button>
        </div>
      </div>
    )
   }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Информация о твоём кошельке</h2>
      <div className="flex justify-between gap-3 scrollbar-hide">
        <Card
          shadow="sm"
          className="w-1/2 bg-orange shadow shadow-md shadow-white/20"
        >
          <CardBody className="flex flex-row justify-between items-start gap-3 h-full p-2 scrollbar-hide">
            <div className="flex flex-col">
              <p className="text-medium text-black">Кошелёк</p>
              <p className="text-small text-default-700">
                {wallet?.name || 'неизвестно'}
              </p>
            </div>
            {wallet?.imageUrl && (
              <Image 
                src={wallet.imageUrl} 
                alt="Логотип кошелька" 
                height={55}
                width={55}  
                className="rounded-medium"
              />
            )}
          </CardBody>
        </Card>
        <Card
          shadow="sm"
          className="flex-1 bg-orange shadow shadow-md shadow-white/20"
        >
          <CardBody className="flex flex-row justify-end items-center h-full p-2">
            <div className="flex flex-col text-right">
              <p className="text-sm text-default-700">Баланс</p>
              <p className="text-lg font-bold text-black">
                {isLoading ? 'Загрузка...' : error ? 'Ошибка :(' : `${balance} Ton`}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {infoWallet.map((walletItem) => {
        let value = wallet[walletItem.key] 

        if(walletItem.key === 'chain') {
          if (value === '-239') value = 'mainnet'
          else if (value === '-3') value = 'testnet'
          else if (value === '0') value = `неизвестная сеть: ${value}`
        }  

        const displayValue = value 
          ? value.length > 20 
            ? `${value.slice(0, 8)}...${value.slice(-8)}`
            : value 
          : 'не определён'
        
        return (
          <Card
            key={walletItem.key}
            className="bg-orange shadow shadow-md shadow-white/20"
          >
            <CardBody className="flex flex-row items-start gap-3 h-full p-2">
              <div className="flex item-center p-2 bg-default-50 border border-default-100 rounded-medium">
                {
                  walletItem.title === "Адрес в блокчейне TON" ? 
                    <Image src={walletItem.icon} alt="TON" height={45} width={45} />
                    : 
                    <Icon icon={walletItem.icon} height="45" width="45" className="text-orange" />
                }
              </div>
              <div className="flex flex-col gap-1/2">
                <p className="text-medium text-black">
                  {walletItem.title}
                </p>
                <div className="text-small text-default-700">
                  <Snippet
                    size="sm"
                    symbol="" 
                    codeString={value || 'неизвестно'}
                  >
                    {displayValue}
                  </Snippet>
                </div>
              </div>
            </CardBody>
          </Card>
        )
      })}
      <Button
        size="lg"
        className="bg-orange shadow-md shadow-white/20 text-sm text-black"
        onPress={disconnect}
      >
        Отключить кошелёк
      </Button>
    </div>
  )
}

