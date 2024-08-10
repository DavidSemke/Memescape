import { array, boolean, date, object, string } from "zod"
import { minMaxErrorMap } from "./errorMsg"

const textLineLen = { max: 100 }

export const postMemeSchema = object({
    template_id: string().uuid(),
    user_id: string().uuid(),
    product_image_id: string().uuid(),
    text: array(
        string({
            errorMap: minMaxErrorMap(textLineLen)
        })
            .trim()
            .max(textLineLen.max)),
    private: boolean(),
    create_date: date()
})