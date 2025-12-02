export const validateEmail = (value: string) : string | null => {
  const emailRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9._+\-]*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*\.[a-zA-Z]{2,}$/i

  if (!emailRegex.test(value)) {
    return 'Некорректный формат email'
  }

  if (value.length < 5) {
    return 'Email слишком короткий'
  }

  if (value.length > 128) {
    return 'Email слишком длинный'
  }
    
  return null
}
