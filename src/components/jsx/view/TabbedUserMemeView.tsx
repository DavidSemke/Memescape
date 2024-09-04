import { getMemes } from "@/data/api/controllers/meme"
import DeepImageGrid, { DeepImageGridFetchAction } from "../grid/DeepImageGrid"
import { getBookmarks } from "@/data/api/controllers/bookmark"
import TabbedView from "./TabbedView"

type TabbedUserMemeView = {
    userId: string
    query: string | null 
    tabPageSize?: number
    includePrivateMemes?: boolean
}

/* 
    Param userId is defined if all memes are to be created by the user.
    If includePrivateMemes is true, 
    1) Bookmarks are included in their own tab.
    2) Memes of private status are included.
*/
export default async function TabbedUserMemeView({
    userId,
    query,
    tabPageSize=10,
    includePrivateMemes=false
}: TabbedUserMemeView) {
    const fetchActions: DeepImageGridFetchAction[] = [
        async (query, page, pageSize) => {
            'use server'
            
            const memes = await getMemes(
                query, 
                page, 
                pageSize, 
                userId,
                undefined,
                includePrivateMemes
            )

            return memes.map(meme => meme.product_image!)
        }
    ]
    const tabLabels = ['Memes']

    if (includePrivateMemes) {
        fetchActions.push(async (query, page, pageSize) => {
            'use server'

            const bookmarks = await getBookmarks(
                query, page, pageSize, userId
            )

            return bookmarks.map(bookmark => bookmark.meme!.product_image!)
        })
        tabLabels.push('Bookmarks')
    }

    const initImages = await Promise.all(
        fetchActions.map(action => action(query, 1, tabPageSize))
    )
    
    const tabs = tabLabels.map((label, index) => {
        return {
            label,
            view: (
                <DeepImageGrid 
                    initImages={initImages[index]}
                    fetchAction={fetchActions[index]}
                    query={query}
                    pageSize={tabPageSize}
                    linkRoot='/memes'
                />
            )
        }
    })

    return (
        <TabbedView 
            tabs={tabs}
        />
    )
}