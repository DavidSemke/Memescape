import Image from "next/image";
import Searchbar from "@/components/form/Searchbar";
import MemeGrid from "@/components/grid/MemeGrid";
import Link from "next/link";

export default function UserMemesPage() {
  const signedIn = true

  return (
    <main className="flex flex-col gap-4 items-center">
      <Searchbar 
        placeholder="Search your memes"
      />
      <div>
        Insert tab container for created, templates, and bookmarks.
      </div>
    </main>
  )
}