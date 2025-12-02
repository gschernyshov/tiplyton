import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '../src/auth/auth'
import { Providers } from '../src/providers/providers'
import { AppLoader } from '../src/hoc/app-loader'
import DeviceMockup from '../src/components/layout/DeviceMockup'
import { Header } from '../src/components/layout/Header'
import { MobileBottomMenu } from '../src/components/layout/MobileBottomMenu'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  variable: '--font-space-grotesk',
  subsets: ['latin'],  
})

const manrope = Manrope({ 
  variable: '--font-manrope',
  subsets: ['latin'],  
})

export const metadata: Metadata = {
  title: 'TiplyTon',
  description: 'TiplyTon',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  
  return (
    <html lang='ru'>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} antialiased px-3 md:px-0`}
      >
        <DeviceMockup>
          <Providers>
            <SessionProvider session={session}>
              <AppLoader>     
                <Header />     
                <main>
                  {children}
                </main>
                <MobileBottomMenu />
              </AppLoader>
            </SessionProvider>
          </Providers>
        </DeviceMockup>
      </body>
    </html>
  )
}


