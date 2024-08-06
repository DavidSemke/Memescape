import MemeGrid from "./MemeGrid";
import { getMemes } from "@/data/api/controllers/meme";

/*
    Shows up to one page's worth of memes in a grid.
    Necessary because otherwise <Suspense> would not work.
    The async fetch cannot occur in the MemeGrid component to solve this 
    because of its involvement with the DeepMemeGrid.
*/
export default async function ShallowMemeGrid() {
    const memes = await getMemes()
    
    return (
        <MemeGrid memes={memes} />
    )
}