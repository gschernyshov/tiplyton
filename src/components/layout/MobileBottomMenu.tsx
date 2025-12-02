'use client'

import Link from 'next/link'
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Icon } from '@iconify/react'

export const MobileBottomMenu = () => {
  return (
    <Navbar
      className="fixed md:absolute top-auto bottom-6 left-12 md:left-6 right-12 md:right-6 w-auto p-3 bg-gray/20 rounded-full shadow shadow-md shadow-white/20" 
      classNames={{
        base: 'h-auto', 
        content: 'h-auto',
        wrapper: 'px-0 mx-0', 
      }}
    >
      <NavbarContent className="!justify-between">
        <NavbarItem>
          <Link 
            href="/posts" 
            className="flex flex-col items-center p-4 bg-orange rounded-full shadow shadow-md shadow-black/10 text-white/75"
          >
            <Icon icon="material-symbols:home-storage-rounded" height="35" width="35" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/create-post" 
            className="flex flex-col items-center p-4 bg-orange rounded-full shadow shadow-md shadow-black/10 text-white/75"
          >
            <Icon icon="material-symbols:add-2-rounded" height="55" width="55" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/profile"
            className="flex flex-col items-center p-4 bg-orange rounded-full shadow shadow-md shadow-black/10 text-white/75"
          >
            <Icon icon="carbon:user-avatar" height="35" width="35" />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

