'use server'

import prisma from "@/data/prisma/client"
import bcrypt from 'bcryptjs'
import { signIn } from '@/app/api/auth/[...nextauth]/auth'
import { postUserSchema } from "@/data/api/validation/user";
import { AuthError } from 'next-auth'
import { FormState } from '@/data/api/types/action'
import { JoinedUser, NestedUser } from '@/data/api/types/model'
import { error500Msg } from '../validation/errorMsg'
import { redirect } from 'next/navigation'
import { base64String } from "../utils";
import { preWhereUserQuery } from "../query/preWhere";

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

    const nestedUser: NestedUser = {
      id: user.u_id,
      name: user.u_name,
      password: user.u_password,
      profile_image_id: user.u_profile_image_id,
      profile_image: null
    }

    if (
      !profile_image
      || !user.u_profile_image_id
    ) {
      return nestedUser
    }

    const image = {
      id: user.ui_id,
      mime_type: user.ui_mime_type,
      base64: base64String(user.ui_data, user.ui_mime_type)
    }
    nestedUser.profile_image = image

    return nestedUser
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