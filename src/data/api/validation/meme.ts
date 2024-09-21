import {
  object,
  string,
  ZodTypeAny,
} from "zod"
import { minMaxErrorMap } from "./errorMsg"

export const textLineLen = { max: 100 }

/* 
    A post request occurs if the user is signed in (userRequired=true).
    Else, the meme can only be downloaded (no post request).
*/
export function createMemeSchema(
  lineCount: number | null,
  userRequired = false,
) {
  if (lineCount && lineCount < 1) {
    throw new Error("Line count must be greater than 0.")
  }

  const preZodObject: Record<string, ZodTypeAny> = {
    template_id: string().min(1, { message: "Template is required." }),
    user_id: string()
      .uuid()
      .nullable()
      .refine((value) => {
        if (userRequired && value === null) {
          return false
        }

        return true
      }, "Value does not agree with user requirement."),
    private: string()
      .nullable()
      .transform((value) => Boolean(value)),
  }

  if (lineCount) {
    for (let i = 1; i < lineCount + 1; i++) {
      preZodObject[`line${i}`] = string({
        errorMap: minMaxErrorMap(`line ${i}`, textLineLen),
      })
        .trim()
        .max(textLineLen.max)
    }
  }

  return object(preZodObject)
}
