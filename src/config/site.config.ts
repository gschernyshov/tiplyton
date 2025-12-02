import { TWalletItem } from '../types/wallet'

export const siteConfig = {
  baseImageUrlUser: 'https://tiplyton.vercel.app/images/user.png',
  ton: {
    manifestUrl: 'https://tiplyton.vercel.app/tonconnect-manifest.json',
    twaReturnUrl: 'https://t.me/tiplyton_bot/tiplyton',
    infoWallet: [
      {
        key: 'address',
        title: 'Адрес в блокчейне TON',
        icon: '/images/ton_symbol.png',
      },
      {
        key: 'publicKey',
        title: 'Публичный ключ',
        icon: 'material-symbols:key-vertical-rounded',
      },
      {
        key: 'chain',
        title: 'Сеть',
        icon: 'material-symbols:webhook',
      },
      {
        key: 'platform',   
        title: 'Платформа',
        icon: 'material-symbols:device-unknown-outline-rounded',
      }
    ] satisfies TWalletItem[]
  }
}


