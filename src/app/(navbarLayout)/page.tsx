import RedirectSearchbar from "@/components/search/RedirectSearchbar";
import ShallowMemeGrid from "@/components/grid/ShallowMemeGrid";
import Link from "next/link";
import { Suspense } from "react";
import Ellipsis from "@/components/loading/Ellipsis";
import { getMemes } from "@/data/api/controllers/meme";

export default async function IndexPage() {
  async function shallowGridFetch(page: number, pageSize: number) {
    return await getMemes(null, page, pageSize)
  }

  return (
    <main className="flex flex-col gap-4 items-center">
      <RedirectSearchbar 
        searchItemName="meme"
        redirectPath="/memes"
      />
      <h1>Hot Memes</h1>
      <Suspense fallback={<Ellipsis />}>
        <ShallowMemeGrid 
          fetchAction={shallowGridFetch}
          pageSize={20}
        />
      </Suspense>
      <div className="flex flex-col items-center gap-4 my-4">
        <p className="text-center">
          Have an idea for a meme?
        </p>
        <Link 
          href='/memes/create'
          className="btn-primary"
        >
          Create
        </Link> 
      </div>
    </main>
  )
}
