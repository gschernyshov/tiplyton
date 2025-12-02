import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { getUserByEmail } from '../utils/user'

type TCredentials = {
  email: string
  password: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Account',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
        },
        password: { 
          label: 'Password', 
          type: 'password',
        }
      },
      authorize: async (credentials) => {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return null
          }

          const { email, password } = credentials as TCredentials

          const user = await getUserByEmail({ email })

          if (!user || !user.password) return null

          const isPasswordValid = await bcryptjs.compare(password, user.password)

          if (!isPasswordValid) return null

          return {
            id: user.id,
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1339200,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      }
    },
  },
})