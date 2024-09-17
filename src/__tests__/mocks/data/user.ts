import { NestedUser, ProcessedImage } from "@/data/api/types/model/types"
import { generateUniqueUsername } from "@/data/placeholder/create/createUserData"
import { mockProcessedImage } from "./image"
import { v4 as uuidv4 } from "uuid"

export function mockUser(
    nameExclusionSet: Set<string> | null = null,
    includeProfileImage=false
): NestedUser {
    let profileImageId: string | null = null
    let profileImage: ProcessedImage | undefined = undefined

    if (includeProfileImage) {
        profileImageId = uuidv4()
        profileImage = mockProcessedImage(profileImageId)
    }

    return {
        id: uuidv4(),
        name: generateUniqueUsername(nameExclusionSet),
        password: '123456',
        profile_image_id: profileImageId,
        profile_image: profileImage
    }
}