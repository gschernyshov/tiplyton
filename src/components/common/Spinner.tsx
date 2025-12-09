'use client'

import { Spinner } from '@heroui/spinner'

export const CardLoading = () => {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner color="warning" labelColor="warning" />
    </div>
  )
}
