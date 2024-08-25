import RedirectSearchbar from "@/components/search/RedirectSearchbar";
import Link from "next/link";
import { Suspense } from "react";
import Ellipsis from "@/components/loading/Ellipsis";
import { getMemes } from "@/data/api/controllers/meme";
import ShallowImageGrid from "@/components/grid/ShallowImageGrid";

export default async function IndexPage() {
  async function shallowGridFetch(page: number, pageSize: number) {
    const memes = await getMemes(null, page, pageSize)
    return memes.map(meme => meme.product_image!)
  }

  return (
    <main className="flex flex-col gap-4 items-center">
      <RedirectSearchbar 
        searchItemName="meme"
        redirectPath="/memes"
      />
      <h1>Hot Memes</h1>
      <Suspense fallback={<Ellipsis />}>
        <ShallowImageGrid
          fetchAction={shallowGridFetch}
          pageSize={20}
          linkRoot="/memes"
        />
      </Suspense>
      <div className="flex flex-col items-center gap-4 mb-4">
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