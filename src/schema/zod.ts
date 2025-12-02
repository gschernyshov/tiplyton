import { object, string } from 'zod'
 
export const registerSchema = object({
  name: string()
    .max(32, 'имя слишком длинное'),
  photoUrl: string()
   .url('URl фото должен быть корректным'),
  tgId: string()
    .min(3, 'Telegram ID обязателен')
    .max(64, 'Telegram ID cлишком длинный'),
  username: string()
    .max(64, 'username слишком длинный'),
  email: string()
    .min(5, 'Email cлишком короткий')
    .max(32, 'Email cлишком длинный')
    .email('некорректный формат Email'),
  password: string()
    .min(6, 'пароль должен содержать 6 символов')
    .max(32, 'пароль слишком длинный'),
  confirmPassword: string()
    .min(6, 'пароль должен содержать 6 символов')
    .max(32, 'пароль слишком длинный'),
})

export const signInSchema = object({
  name: string()
    .max(32, 'имя слишком длинное'),
  photoUrl: string()
   .url('URl фото должен быть корректный'),
  tgId: string()
    .min(3, 'Telegram ID обязателен')
    .max(64, 'Telegram ID cлишком длинный'),
  username: string()
    .max(64, 'username слишком длинный'),
  email: string()
    .min(5, 'Email cлишком короткий')
    .max(32, 'Email cлишком длинный')
    .email('некорректный формат Email'),
  password: string()
    .min(6, 'пароль должен содержать 6 символов')
    .max(32, 'пароль слишком длинный'),
}) 

export const updateProfileDescriptionSchema = object({
  description: string()
    .min(6, 'описание слишком длинное')
    .max(256, 'описание слишком длинное'),
})

export const resetPasswordSchema = object({
  email: string()
    .min(5, 'Email cлишком короткий')
    .max(32, 'Email cлишком длинный')
    .email('некорректный формат Email'),
})

export const deleteProfileSchema = object({
  id: string(),
})

export const createPostSchema = object({
  authorAddressWallet: string(),
  title: string()
    .min(6, 'Заголовок поста слишком короткий')
    .max(128, 'Заголовок поста слишком длинный'),
  content: string()
    .min(6, 'Описание поста слишком короткое')
    .max(512, 'Описание поста слишком длинное'),
})

export const deletePostSchema = object({
  postId: string(),
})

export const toggleFavoriteSchema = object({
  postId: string(),
})

export const toggleLikeSchema = object({
  postId: string(),
})

