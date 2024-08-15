import { 
  BookmarkIcon, 
  ArrowDownTrayIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import RedirectSearchbar from "@/components/search/RedirectSearchbar"
import ShallowMemeGrid from "@/components/grid/ShallowMemeGrid"
import Image from "next/image"
import { getMemes, getOneMeme, getRelatedMemes } from "@/data/api/controllers/meme"
import { notFound } from "next/navigation"
import { formatDate } from '@/components/utils'
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { postBookmark } from "@/data/api/controllers/bookmark"
import { NestedMeme } from "@/data/api/types/model/types"

export default async function MemePage({ params }: { params: { memeId: string }}) {
  const [session, mainMeme] = await Promise.all([
    auth(),
    getOneMeme(params.memeId)
  ])

  if (mainMeme === null) {
    notFound()
  }

  if (
    !mainMeme.product_image
    || !mainMeme.template
    || !mainMeme.user
  ) {
    throw new Error('Nested meme lacks data.')
  }

  const sessionUser = session?.user
  const memeImageSrc = mainMeme.product_image.base64
  const alt = [
    mainMeme.template.name,
    mainMeme.text.join('. ')
  ].join('. ')
  const createDate = formatDate(mainMeme.create_date)
  const author = mainMeme.user
  let authorImageSrc = null

  if (author.profile_image) {
    authorImageSrc = author.profile_image.base64
  }

  const downloadName = [
    mainMeme.template.name,
    mainMeme.product_image.mime_type
  ].join('.').replaceAll(' ', '-')

  async function shallowGridFetch(
    page: number, pageSize: number
  ) {
    if (mainMeme === null) {
      return await getMemes(null, page, pageSize)
    }

    let shortCount = pageSize
    const memes: NestedMeme[] = []

    const relatedMemes = await getRelatedMemes(
      mainMeme, page, shortCount
    )
    memes.push(...relatedMemes)
    shortCount -= memes.length
    
    if (shortCount > 0) {
      const excludeIds = memes.map(meme => meme.id)
      excludeIds.push(mainMeme.id)
      const shortMemes = await getMemes(
          null, page, shortCount, undefined, excludeIds
      )
      memes.push(...shortMemes)
    }

    return memes
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
            <div className="font-semibold">Creator:</div>
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
          <div className="flex gap-2">
            <div className="font-semibold">Created on:</div>
            <time>{createDate}</time>
          </div>
        </div>
        
        <div className="flex gap-4 w-full">
          {
            sessionUser && (
              <form action={postBookmark}>
                <input type='hidden' name="user_id" value={sessionUser.id} />
                <input type='hidden' name="meme_id" value={mainMeme.id} /> 
                <button
                  type='submit'
                  aria-label="Bookmark meme"
                  className="btn-secondary"
                >
                  <BookmarkIcon 
                      className="w-8 h-8"
                  />
                </button>
              </form>
            )
          }
          <a
            href={memeImageSrc}
            download={downloadName}
            aria-label="Download meme"
            className="btn-secondary"
          >
            <ArrowDownTrayIcon 
                className="w-8 h-8"
            />
          </a>
        </div>
      </section>
      <section className="w-full">
        <h2 className="pb-2 mb-4 border-b-2 border-stress-secondary">More Memes</h2>
        <ShallowMemeGrid 
          fetchAction={shallowGridFetch}
          pageSize={20}
        />
      </section>
    </main>
  )
}