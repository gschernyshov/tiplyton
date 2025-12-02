'use client'

import type { PropsWithChildren } from 'react'
import { TelegramProvider } from './telegram.provider'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { HeroUIProvider } from '@heroui/react'
import { siteConfig } from '../config/site.config'

export const Providers = ({ children }: PropsWithChildren) => {
  const {manifestUrl, twaReturnUrl} = siteConfig.ton

  return (
    <TelegramProvider>
      <TonConnectUIProvider
        manifestUrl={manifestUrl}
        actionsConfiguration={{
          twaReturnUrl: twaReturnUrl as `${string}://${string}`,
        }}
      >
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </TonConnectUIProvider>
    </TelegramProvider>
  )
}
