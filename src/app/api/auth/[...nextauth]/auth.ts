import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { getUserByName } from "@/data/api/controllers/user"
import { signInUserSchema } from "@/data/api/validation/user"
import { ZodError } from "zod"
import { NestedUser } from "@/data/api/types/model"
import { AdapterUser } from "next-auth/adapters"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in'
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    session: async ({ session, token }) => {
      session.user = token.user as NestedUser & AdapterUser;
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          const {username, password} = await signInUserSchema.parseAsync(credentials)

          const user = await getUserByName(username, true)

          if (!user) {
            return null
          }
  
          const match = await bcrypt.compare(password, user.password)

          if (!match) {
            return null
          }

          return user
        }
        catch(error) {
          if (error instanceof ZodError) {
            return null
          }

          throw error
        }
      },
    })
  ],
})