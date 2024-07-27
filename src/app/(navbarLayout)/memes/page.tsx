import Searchbar from "@/components/form/Searchbar";
import MemeGrid from "@/components/grid/MemeGrid";

export default function MemeSearchPage() {
  return (
    <main className="flex flex-col gap-4 items-center">
      <Searchbar 
        placeholder="Search for memes"
      />
      <MemeGrid 
        memes={[]}
      />
    </main>
  )
}