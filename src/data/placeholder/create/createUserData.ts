import { v4 as uuidv4 } from "uuid"
import { Image, User } from "@prisma/client"
import bcrypt from "bcryptjs"

const usernames = ["Alexus", "Barney", "Carrie"]
const password = "123456"

function generateUsername() {
  return Math.random().toString(36).slice(2, 8)
}

export function generateUniqueUsername(exclusionSet: Set<string> | null) {
  if (!exclusionSet) {
    return generateUsername()
  }

  let name: string

  do {
    name = generateUsername()
  } while (exclusionSet.has(name))

  return name
}

export default async function createUserData(
  profileImages: Image[],
  count = 3,
): Promise<User[]> {
  const minCount = profileImages.length

  if (minCount > count) {
    throw new Error("Count cannot be less than the number of profile images.")
  }

  const users: User[] = []
  const nameSet = new Set(usernames)

  for (let i = 0; i < count; i++) {
    let name: string | null = null

    // If count exceeds num of given usernames, generate username
    if (i < usernames.length) {
      name = usernames[i]
    } else {
      name = generateUniqueUsername(nameSet)
      nameSet.add(name)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({
      id: uuidv4(),
      name,
      password: hashedPassword,
      profile_image_id: profileImages[i]?.id ?? null,
    })
  }

  return users
}
