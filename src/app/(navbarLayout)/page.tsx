import RedirectSearchbar from "@/components/jsx/search/RedirectSearchbar"
import Link from "next/link"
import { Suspense } from "react"
import Ellipsis from "@/components/jsx/loading/Ellipsis"
import { getMemes } from "@/data/api/controllers/meme"
import ShallowImageGrid from "@/components/jsx/grid/ShallowImageGrid"

export default async function IndexPage() {
  async function shallowGridFetch(page: number, pageSize: number) {
    const memes = await getMemes(null, page, pageSize)
    return memes.map((meme) => meme.product_image!)
  }
  return (
    <main className="min-h-screen-ex-topbar">
      <RedirectSearchbar searchItemName="meme" redirectPath="/memes" />
      <h1>Hot Memes</h1>
      <Suspense fallback={<Ellipsis />}>
        <ShallowImageGrid
          fetchAction={shallowGridFetch}
          pageSize={20}
          linkRoot="/memes"
        />
      </Suspense>
      <div className="mb-4 flex w-full flex-col items-center gap-4">
        <p className="text-center">Have an idea for a meme?</p>
        <Link href="/memes/create" className="btn-primary w-1/2">
          Create
        </Link>
      </div>
    </main>
  )
}
