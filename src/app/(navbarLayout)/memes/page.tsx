import Searchbar from "@/components/form/Searchbar";
import ImageGrid from "@/components/ImageGrid";

export default function MemeSearchPage() {
  return (
    <main className="flex flex-col gap-4 items-center">
      <Searchbar 
        placeholder="Search for memes"
      />
      <ImageGrid 
        images={[]}
      />
    </main>
  )
}