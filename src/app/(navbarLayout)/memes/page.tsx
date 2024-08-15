import UrlSearchbar from "@/components/search/UrlSearchbar";
import DeepMemeGrid from "@/components/grid/DeepMemeGrid";
import { getMemes } from "@/data/api/controllers/meme";

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
    return await getMemes(query, page, pageSize)
  }
  
  return (
    <main className="flex flex-col gap-4 items-center">
      <UrlSearchbar 
        placeholder="Search for memes"
      />
      <DeepMemeGrid 
        fetchAction={fetchAction}
        query={query}
        pageSize={pageSize}
      />
    </main>
  )
}