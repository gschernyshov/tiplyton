export type TFormRegisterData = {
  name: string
  photoUrl: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type TFormLoginData = {
  email: string
  password: string
}

export type TFormCreatePost = {
  title: string
  content: string
}

export type TEditDescriptionUser = {
  state: boolean
  isLoading: boolean
  value: string
}

export type TStateError = {
  error: boolean
  message: string
}