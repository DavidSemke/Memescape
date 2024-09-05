"use server"

import prisma from "@/data/prisma/client"
import bcrypt from "bcryptjs"
import { auth, signIn } from "@/app/api/auth/[...nextauth]/auth"
import { postUserSchema } from "@/data/api/validation/user"
import { AuthError } from "next-auth"
import { FormState } from "@/data/api/types/action/types"
import { JoinedUser, NestedUser } from "@/data/api/types/model/types"
import { error500Msg } from "../validation/errorMsg"
import { redirect } from "next/navigation"
import { nestUser } from "../types/model/transforms"
import { preWhereUserQuery } from "../query/preWhere"
import { createPutUserSchema } from "@/data/api/validation/user"
import { revalidatePath } from "next/cache"

export async function signInUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await signIn("credentials", {
      redirect: false,
      username: formData.get("username"),
      password: formData.get("password"),
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid username or password."
    }

    return error500Msg
  }

  // Redirect throws an error, so no need to return FormState
  redirect("/")
}

export async function getOneUser(
  id: string | undefined = undefined,
  name: string | undefined = undefined,
  includeProfileImage = false,
): Promise<NestedUser | null> {
  const querySegments = [preWhereUserQuery(includeProfileImage)]
  const wherePredicates = []
  const tokens = []
  let tokenIndex = 1

  if (id !== undefined) {
    wherePredicates.push(`u.id = $${tokenIndex++}::uuid`)
    tokens.push(id)
  }

  if (name !== undefined) {
    wherePredicates.push(`u.name ILIKE $${tokenIndex++}`)
    tokens.push(name)
  }

  if (wherePredicates.length) {
    querySegments.push(`WHERE ${wherePredicates.join(" AND ")}`)
  }

  querySegments.push("LIMIT 1")

  try {
    const [user = null] = await prisma.$queryRawUnsafe<JoinedUser[]>(
      querySegments.join(" "),
      ...tokens,
    )

    if (!user) {
      return user
    }

    return nestUser(user)
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch user.")
  }
}

export async function postUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parse = await postUserSchema.safeParseAsync({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    }
  }

  const { username, password } = parse.data

  try {
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name: username,
        password: hash,
      },
    })
  } catch (error) {
    return error500Msg
  }

  return await signInUser(false, formData)
}

export async function putUser(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth()
  const sessionUser = session?.user
  const sessionUser404 = "Session user does not exist for user update."

  if (!sessionUser) {
    throw new Error(sessionUser404)
  }

  const fullSessionUser = await getOneUser(sessionUser.id, undefined, false)

  if (!fullSessionUser) {
    throw new Error(sessionUser404)
  }

  const putUserSchema = createPutUserSchema(fullSessionUser.name)
  const parse = await putUserSchema.safeParseAsync({
    username: formData.get("username"),
    profileImage: formData.get("profile-image"),
  })

  if (!parse.success) {
    const errors = parse.error.flatten().fieldErrors
    return { errors }
  }

  const { username, profileImage } = parse.data

  try {
    let profilePic = null

    // Update/Create profile image
    if (profileImage) {
      if (fullSessionUser.profile_image_id) {
        profilePic = await prisma.image.update({
          where: {
            id: fullSessionUser.profile_image_id,
          },
          data: {
            mime_type: profileImage.type,
            data: Buffer.from(await profileImage.arrayBuffer()),
          },
        })
      } else {
        profilePic = await prisma.image.create({
          data: {
            mime_type: profileImage.type,
            data: Buffer.from(await profileImage.arrayBuffer()),
          },
        })
      }
    }

    // Update user
    await prisma.user.update({
      where: {
        id: sessionUser.id,
      },
      data: {
        name: username,
        profile_image_id: profilePic?.id,
      },
    })
  } catch (error) {
    return error500Msg
  }

  if (username !== fullSessionUser.name) {
    redirect(`/${username}`)
  }

  revalidatePath(`/${username}`)

  return true
}
