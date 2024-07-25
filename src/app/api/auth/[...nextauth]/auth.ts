import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { getUserByName } from "@/data/api/controllers/user"
import { signInUserSchema } from "@/data/api/validation/user"
import { ZodError } from "zod"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in'
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    }
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

          if (!user.profile_image) {
            return user
          }

          const image = user.profile_image
          const base64 = image.data.toString('base64')
          const profileImageBase64 = `data:${image.mime_type};base64,${base64}`
          
          return {
            ...user,
            profile_image_base64: profileImageBase64
          }
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