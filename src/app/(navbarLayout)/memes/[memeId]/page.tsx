import { BookmarkSquareIcon, BookmarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Searchbar from "@/components/form/Searchbar";
import MemeGrid from "@/components/grid/MemeGrid";
import Image from "next/image";

export default function MemePage() {
  const signedIn = false

  return (
    <main className="flex flex-col gap-4 items-center">
      <Searchbar 
        placeholder="Search for memes"
      />
      <Image 
        src='/logo.png'
        width={64}
        height={64}
        alt=''
      />
      <section className="flex gap-4">
        <button
          type='button'
          aria-labelledby="bookmark-meme-button__label"
        >
          <BookmarkIcon 
              className="w-8 h-8"
          />
          <div id='bookmark-meme-button__label'>Bookmark Meme</div>
        </button>
        <button
          type='button'
          aria-labelledby="bookmark-template-button__label"
        >
          <BookmarkSquareIcon 
              className="w-8 h-8"
          />
          <div id='bookmark-template-button__label'>Bookmark Template</div>
        </button>
        <button
          type='button'
          aria-labelledby="download-button__label"
        >
          <ArrowDownTrayIcon 
              className="w-8 h-8"
          />
          <div id='download-button__label'>Download</div>
        </button>
      </section>
      <section>
        <h2 className="pb-2 border-b border-stress-secondary">Related Memes</h2>
        <MemeGrid 
          memes={[]}
        />
      </section>
    </main>
  )
}