'use client'

import { Spinner } from '@heroui/spinner'

interface IProps {
  label: string
}

export const CardLoading = ({ label }: IProps) => {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner color="warning" labelColor="warning" />
    </div>
  )
}
