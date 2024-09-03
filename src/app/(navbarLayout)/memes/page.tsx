import UrlSearchbar from "@/components/jsx/search/UrlSearchbar";
import DeepImageGrid from "@/components/jsx/grid/DeepImageGrid";
import { getMemes } from "@/data/api/controllers/meme";
// import { Suspense } from "react";
// import Ellipsis from "@/components/loading/Ellipsis";

type PageProps = {
  searchParams?: {
    query?: string
  }
}

export default async function MemeSearchPage({ searchParams }: PageProps) {
  const query = searchParams?.query || ''
  const pageSize = 20

  async function fetchAction(
    query: string | null, 
    page: number, 
    pageSize: number
  ) {
    'use server'
            
    const memes = await getMemes(
        query, page, pageSize
    )

    return memes.map(meme => meme.product_image!)
  }

  const initImages = await fetchAction(query, 1, pageSize)
  
  return (
    <main className="flex flex-col gap-4 items-center">
      <UrlSearchbar 
        searchItemName="meme"
      />
      
      <DeepImageGrid 
        initImages={initImages}
        fetchAction={fetchAction}
        query={query}
        pageSize={pageSize}
      />
      
      
    </main>
  )
}