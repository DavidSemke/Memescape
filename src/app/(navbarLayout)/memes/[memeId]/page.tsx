import { 
  BookmarkIcon, 
  ArrowDownTrayIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import RedirectSearchbar from "@/components/search/RedirectSearchbar"
import ShallowMemeGrid from "@/components/grid/ShallowMemeGrid"
import Image from "next/image"
import { getMemeById } from "@/data/api/controllers/meme"
import { notFound } from "next/navigation"
import { formatDate } from '@/components/utils'

export default async function MemePage({ params }: { params: { memeId: string }}) {
  const mainMeme = await getMemeById(params.memeId)

  if (mainMeme === null) {
    notFound()
  }

  const memeImageSrc = mainMeme.product_image.base64
  const alt = `${mainMeme.template.name}. ${mainMeme.text.join('. ')}`
  const createDate = formatDate(mainMeme.create_date)
  
  const author = mainMeme.user
  let authorImageSrc = null

  if (author.profile_image) {
    authorImageSrc = author.profile_image.base64
  }
  
  return (
    <main className="flex flex-col gap-8 items-center">
      <RedirectSearchbar 
        placeholder="Search for memes"
        redirectPath="/memes"
      />
      <section className="flex flex-col gap-4">
        <Image
          src={memeImageSrc}
          width={0}
          height={0}
          alt={alt}
          className="w-full border-2 border-stress-secondary"
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div>Creator: </div>
            {
              authorImageSrc ? (
                <Image
                  src={authorImageSrc}
                  width={32}
                  height={32}
                  alt={`${author.name}'s profile picture.`}
                  className="rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8" />
              )
            }
            <div>{author.name}</div>
          </div>
          <div>
            Created on: <time>{createDate}</time>
          </div>
        </div>
        
        <div className="flex gap-4 w-full">
          <button
            type='button'
            aria-label="Bookmark meme"
            className="btn-secondary"
          >
            <BookmarkIcon 
                className="w-8 h-8"
            />
          </button>
          <button
            type='button'
            aria-label="Download meme"
            className="btn-secondary"
          >
            <ArrowDownTrayIcon 
                className="w-8 h-8"
            />
          </button>
        </div>
      </section>
      <section className="w-full">
        <h2 className="pb-2 mb-4 border-b-2 border-stress-secondary">More Memes</h2>
        <ShallowMemeGrid 
          relationMeme={mainMeme}
        />
      </section>
    </main>
  )
}