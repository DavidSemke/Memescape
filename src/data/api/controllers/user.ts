'use server'

import prisma from "@/data/prisma/client"
import bcrypt from 'bcryptjs'
import { auth, signIn } from '@/app/api/auth/[...nextauth]/auth'
import { postUserSchema } from "@/data/api/validation/user";
import { AuthError } from 'next-auth'
import { FormState } from '@/data/api/types/action/types'
import { JoinedUser, NestedUser } from '@/data/api/types/model/types'
import { error500Msg } from '../validation/errorMsg'
import { redirect } from 'next/navigation'
import { nestUser } from "../types/model/transforms";
import { preWhereUserQuery } from "../query/preWhere";
import { createPutUserSchema } from "@/data/api/validation/user";
// import formidable, {errors as formidableErrors} from 'formidable';

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

    // Redirect throws an error, so no need to return FormState
    redirect('/')
}

export async function getUserByName(
  name: string, profile_image=false
): Promise<NestedUser | null> {
    const query = preWhereUserQuery(profile_image) 
      + ` WHERE name ILIKE $1 LIMIT 1`
    let user = null

    try {
      const users = await prisma.$queryRawUnsafe<JoinedUser[]>(
        query, name
      )
      user = users[0]
    }
    catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch user.');
    }

    if (!user) {
      return user
    }

    return nestUser(user)
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

export async function putUser(
  prevState: FormState, formData: FormData
): Promise<FormState> {
  const session = await auth()
  const sessionUser = session?.user

  if (!sessionUser) {
    throw new Error('Session user does not exist for user update.')
  }

  const putUserSchema = createPutUserSchema(sessionUser.name)
  const parse = await putUserSchema.safeParseAsync({
      username: formData.get('username'),
      profileImage: formData.get('profile-pic')
  })

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors
    }
  }

  const { username, profileImage } = parse.data

  if (profileImage === undefined) {
    return false
  }

  console.log('Size: ' + profileImage.size)

  try {
    let profilePic = null
    
    // if (profileImage) {
    //   profilePic = await prisma.image.create({
    //     data: {
          
    //     }
    //   })
    // }
    

    // await prisma.user.update({
    //   where: {
    //     name: username
    //   },
    //   data: {
    //     name: username,
    //     profile_image_id: profilePic.id
    //   }
    // })
  }
  catch (error) {
    return error500Msg
  }

  return true
}