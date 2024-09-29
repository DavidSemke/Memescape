import { NestedTemplate, ProcessedImage } from "@/data/api/types/model/types"
import { mockProcessedImage } from "./image"
import { v4 as uuidv4 } from "uuid"

export function mockTemplate(
  imageProps?: { alt?: string; id?: string },
  lines = 2,
): NestedTemplate {
  let image: ProcessedImage | undefined = undefined

  if (imageProps) {
    image = mockProcessedImage(imageProps.alt, imageProps.id)
  }

  return {
    id: uuidv4(),
    name: "",
    keywords: [],
    lines,
    image,
  }
}
