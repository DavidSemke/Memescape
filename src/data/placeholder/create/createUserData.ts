import { v4 as uuidv4 } from "uuid"
import { Image, User } from "@prisma/client"
import bcrypt from "bcryptjs"

function generateUsername() {
  return Math.random().toString(36).slice(2, 8)
}

export function generateUniqueUsername(
  exclusionSet: Set<string> | null = null
) {
  if (!exclusionSet) {
    return generateUsername()
  }

  let name: string

  do {
    name = generateUsername()
  } while (exclusionSet.has(name))

  return name
}

export async function createOneUser(
  name: string,
  profileImageId: string | null = null
) {
  const hashedPassword = await bcrypt.hash('123456', 10)

  return {
    id: uuidv4(),
    name,
    password: hashedPassword,
    profile_image_id: profileImageId,
  }
}

export default async function createUserData(
  usernames: string[],
  profileImages: Image[],
  count = 3,
): Promise<User[]> {
  const minCount = profileImages.length

  if (minCount > count) {
    throw new Error("Count cannot be less than the number of profile images.")
  }

  const users = []
  const nameSet = new Set<string>()

  for (let i = 0; i < count; i++) {
    const name = usernames[i] ?? generateUniqueUsername(nameSet)
    users.push(await createOneUser(
      name, 
      profileImages[i]?.id ?? null
    ))
    nameSet.add(name)
  }

  return users
}