'use client'

import { useState, useEffect, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const DeviceMockup = ({ children }: IProps) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)

    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  if (!isDesktop) return <>{children}</>

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-[100vw]">
      <div className="relative h-[700px] w-[350px] mx-auto bg-gray-800 border-[14px] border-gray-800 rounded-[2.5rem] shadow-xl">
        <div className="absolute top-0 left-1/2 h-[18px] w-[148px] -translate-x-1/2 bg-gray-800 rounded-b-[1rem] z-50"></div>
        <div className="absolute top-[124px] h-[46px] w-[3px] -start-[17px] bg-gray-800 rounded-s-lg"></div>
        <div className="absolute top-[178px] h-[46px] w-[3px] -start-[17px] bg-gray-800 rounded-s-lg"></div>
        <div className="absolute h-[64px] w-[3px] top-[142px] -end-[17px] bg-gray-800 rounded-e-lg"></div>
        <div className="absolute inset-0 flex h-full w-full px-3 overflow-hidden bg-black rounded-[2rem]">
          <div className="flex-1 min-h-full overflow-y-auto scrollbar-hide">
            {children}
          </div>
       </div>
      </div>
    </div>
  )
}

export default DeviceMockup
