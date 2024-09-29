import { NestedUser, ProcessedImage } from "@/data/api/types/model/types"
import {
  generateUniqueUsername,
  createOneUser,
} from "@/data/placeholder/create/createUserData"
import { mockProcessedImage } from "./image"
import { v4 as uuidv4 } from "uuid"

export async function mockUser(
  nameExclusionSet: Set<string> | null = null,
  includeProfileImage = false,
): Promise<NestedUser> {
  let profileImageId: string | null = null
  let profileImage: ProcessedImage | undefined = undefined

  if (includeProfileImage) {
    profileImageId = uuidv4()
    profileImage = mockProcessedImage(profileImageId)
  }

  const baseUser = await createOneUser(
    generateUniqueUsername(nameExclusionSet),
    profileImageId,
  )

  return {
    ...baseUser,
    profile_image: profileImage,
  }
}
