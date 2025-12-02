'use client'

interface IProps {
  title: string
}

export const MessageError = ({ title }: IProps) => {
  return (
    <div className="flex justify-center items-center pt-25">
      <p className="text-center">
        {title}
      </p>
    </div>
  )
}
