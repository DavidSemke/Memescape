import UrlSearchbar from "@/components/search/UrlSearchbar";
import DeepMemeGrid from "@/components/grid/DeepMemeGrid";

type PageProps = {
  searchParams?: {
    query?: string;
    page?: string;
  }
}

export default async function MemeSearchPage({ searchParams }: PageProps) {
  const query = searchParams?.query || ''
  
  return (
    <main className="flex flex-col gap-4 items-center">
      <UrlSearchbar 
        placeholder="Search for memes"
      />
      <DeepMemeGrid query={query}/>
    </main>
  )
}