import { NestedMeme, NestedUser } from "@/data/api/types/model/types"
import { createOneMeme } from "@/data/placeholder/create/createMemeData"
import { mockProcessedImage } from "./image"
import { mockUser } from "./user"
import { v4 as uuidv4 } from "uuid"

// Template object is omitted.
export async function mockMeme(user?: NestedUser): Promise<NestedMeme> {
  if (!user) {
    user = await mockUser()
  }
  
  const productImage = mockProcessedImage()
  const baseMeme = createOneMeme(
    uuidv4(),
    user.id,
    [],
    false,
    productImage.id
  )

  return {
    ...baseMeme,
    product_image: productImage,
    user
  }
}
