import UrlSearchbar from "@/components/jsx/search/UrlSearchbar"
import DeepImageGrid from "@/components/jsx/grid/deepImageGrid/DeepImageGrid"
import { getMemes } from "@/data/api/controllers/meme"
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import TabbedUserMemeView from "@/components/jsx/view/TabbedUserMemeView"

type PageProps = {
  searchParams?: {
    query?: string
    ["user-id"]?: string
  }
}

export default async function MemeSearchPage({ searchParams }: PageProps) {
  const session = await auth()
  const sessionUserId = session?.user?.id

  const query = searchParams?.query || ""
  const userId = searchParams?.["user-id"]
  const sessionUserIdInUrl =
    sessionUserId !== undefined && sessionUserId === userId
  const pageSize = 20

  async function fetchAction(
    query: string | null,
    page: number,
    pageSize: number,
  ) {
    "use server"

    const memes = await getMemes(
      query,
      page,
      pageSize,
      userId,
      undefined,
      sessionUserIdInUrl,
    )

    return memes.map((meme) => meme.product_image!)
  }

  return (
    <main className="min-h-screen-ex-topbar">
      <UrlSearchbar searchItemName="meme" />
      {sessionUserIdInUrl ? (
        <TabbedUserMemeView
          userId={userId}
          query={query}
          tabPageSize={20}
          includePrivateMemes={true}
        />
      ) : (
        <DeepImageGrid
          addInitImages={true}
          fetchAction={fetchAction}
          query={query}
          pageSize={pageSize}
          linkRoot="/memes"
        />
      )}
    </main>
  )
}
