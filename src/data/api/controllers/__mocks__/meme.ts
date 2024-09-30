import { mockProcessedImage } from "@/data/placeholder/create/mocks/image"
import { FormState } from "../../types/action/types"

module.exports = {
  ...jest.requireActual("@/data/api/controllers/meme"),
  generateMemeImage: jest.fn(async (templateId: string, text: string[]) => {
    return mockProcessedImage()
  }),
  postMeme: jest.fn(
    async (
      lineCount: number | null,
      prevState: FormState,
      formData: FormData,
    ) => {
      return true
    },
  ),
}
