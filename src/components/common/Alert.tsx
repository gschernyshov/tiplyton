'use client'

import { Alert as AlertHeroui } from '@heroui/alert'

interface IProps {
  error: boolean
  message: string
}

export const Alert = ({ error, message}: IProps) => {
  return (
    <AlertHeroui 
      key={message}
      color={error ? 'warning' : 'success'} 
      title={message} 
    />
  )
}