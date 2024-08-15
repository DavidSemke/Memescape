import { NestedMeme } from "@/data/api/types/model/types";
import MemeGrid from "./MemeGrid";

type ShallowMemeGridProps = {
    fetchAction: (
        page: number, 
        pageSize: number
    ) => Promise<NestedMeme[]>
    pageSize: number
}

/*
    Shows up to one page's worth of memes in a grid.
    Necessary because otherwise <Suspense> would not work.
    The async fetch cannot occur in the MemeGrid component to solve this 
    because of its involvement with the DeepMemeGrid.
    
    Prop relationMeme is a meme that grid memes preferably relate to.
*/
export default async function ShallowMemeGrid({
    fetchAction, pageSize
}: ShallowMemeGridProps) {
    const memes = await fetchAction(1, pageSize)

    return (
        <MemeGrid memes={memes} />
    )
}