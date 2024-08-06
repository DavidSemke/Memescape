import { NestedMeme } from "@/data/api/types/model";
import MemeGrid from "./MemeGrid";
import { getMemes, getRelatedMemes } from "@/data/api/controllers/meme";

type ShallowMemeGridProps = {
    limit?: number,
    relationMeme?: NestedMeme | null
}

/*
    Shows up to one page's worth of memes in a grid.
    Necessary because otherwise <Suspense> would not work.
    The async fetch cannot occur in the MemeGrid component to solve this 
    because of its involvement with the DeepMemeGrid.
    
    Prop relationMeme is a meme that grid memes preferably relate to.
*/
export default async function ShallowMemeGrid({
    limit=20, relationMeme=null
}: ShallowMemeGridProps) {
    const memes: NestedMeme[] = []

    if (relationMeme !== null) {
        const relatedMemes = await getRelatedMemes(relationMeme)
        memes.push(...relatedMemes)

        const shortCount = limit - memes.length

        if (shortCount > 0) {
            const excludeIds = memes.map(meme => meme.id)
            excludeIds.push(relationMeme.id)
            const shortMemes = await getMemes(
                null, 1, shortCount, undefined, excludeIds
            )
            memes.push(...shortMemes)
        }
    }
    else {
        const newMemes = await getMemes(null, 1, limit)
        memes.push(...newMemes)
    }

    return (
        <MemeGrid memes={memes} />
    )
}