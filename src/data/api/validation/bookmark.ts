import { object, string } from "zod"
import { getOneBookmark } from "../controllers/bookmark"

export const postBookmarkSchema = object({
    user_id: string().uuid(),
    meme_id: string().uuid(),
}).refine(
    async (value) => {
        const { user_id, meme_id } = value
        const bookmark = await getOneBookmark(user_id, meme_id)

        return bookmark === null
    },
    { message: 'Bookmark already exists.' }
)