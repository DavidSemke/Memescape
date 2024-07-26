'use server'

import { JoinedUser, NestedJoinedUser } from '@/data/api/definitions'
import prisma from "@/data/prisma/client"
import bcrypt from 'bcryptjs'
import { signIn } from '@/app/api/auth/[...nextauth]/auth'
import { postUserSchema } from "@/data/api/validation/user";
import { AuthError } from 'next-auth'
import { FormState } from '@/data/api/definitions'
import { error500Msg } from '../validation/errorMsg'
import { redirect } from 'next/navigation'

export async function signInUser(
  prevState: FormState, formData: FormData
): Promise<FormState> {
    try {
      await signIn('credentials', {
        redirect: false,
        username: formData.get('username'),
        password: formData.get('password')
      })
    }
    catch(error) {
      if (error instanceof AuthError) {
        return 'Invalid username or password.'
      }

      return error500Msg
    }

    redirect('/')
}

export async function getUserByName(
  name: string, profile_image=false
): Promise<NestedJoinedUser | null> {
    try {
      let user = null

      if (profile_image) {
        const users = await prisma.$queryRaw<JoinedUser[]>`
          SELECT u.*, i.data, i.mime_type FROM "User" as u 
          LEFT JOIN "Image" as i ON u.profile_image_id = i.id 
          WHERE name ILIKE ${name} LIMIT 1
        `
        user = users[0]
      }
      else {
        const users = await prisma.$queryRaw<JoinedUser[]>`
          SELECT * FROM "User" 
          WHERE name ILIKE ${name} LIMIT 1
        `
        user = users[0]
      }
      

      if (!user) {
        return user
      }

      if (
        !profile_image 
        || !user.profile_image_id 
        || !user.data 
        || !user.mime_type
      ) {
        delete user.data
        delete user.mime_type

        return user
      }

      const image = {
        id: user.profile_image_id,
        data: user.data,
        mime_type: user.mime_type
      }
      delete user.data
      delete user.mime_type

      const nestedUser: NestedJoinedUser = {
        ...user,
        profile_image: image
      }
      
      return nestedUser
    } 
    catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch user.');
    }
}

export async function postUser(
  prevState: FormState, formData: FormData
): Promise<FormState> {
  const parse = await postUserSchema.safeParseAsync({
      username: formData.get('username'),
      password: formData.get('password')
  })

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors
    }
  }

  const { username, password } = parse.data

  try {
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name: username,
        password: hash
      }
    })
  }
  catch (error) {
    return error500Msg
  }

  return await signInUser(false, formData)
}