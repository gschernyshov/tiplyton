'use server'

import bcryptjs from 'bcryptjs'
import generator from 'generate-password'

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10

  return await bcryptjs.hash(password, saltRounds)
}

export async function generatePassword(): Promise<string> {
  const lengthPassword = 10

  return await generator.generate({
    length: lengthPassword,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  }) 
}