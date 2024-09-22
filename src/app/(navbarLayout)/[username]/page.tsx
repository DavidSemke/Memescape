import { auth } from "@/app/api/auth/[...nextauth]/auth"
import ProfileForm from "@/components/jsx/form/profileForm/ProfileForm"
import { getOneUser } from "@/data/api/controllers/user"
import { NestedUser } from "@/data/api/types/model/types"
import { notFound } from "next/navigation"
import ProfileView from "@/components/jsx/view/ProfileView"
import RedirectSearchbar from "@/components/jsx/search/RedirectSearchbar"
import TabbedUserMemeView from "@/components/jsx/view/TabbedUserMemeView"

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const session = await auth()
  const sessionUser = session?.user
  let fullSessionUser = null

  if (sessionUser) {
    fullSessionUser = await getOneUser(sessionUser.id, undefined, true)
  }

  let isSelfProfile = false
  let profileUser: NestedUser | null = null
  let possessive: string | null = null

  if (fullSessionUser && fullSessionUser.name === params.username) {
    profileUser = fullSessionUser
    isSelfProfile = true
    possessive = "Your"
  } else {
    profileUser = await getOneUser(undefined, params.username, true)

    if (profileUser === null) {
      notFound()
    }

    possessive = `${profileUser.name}'s`
  }

  const profileView = (
    <ProfileView
      user={profileUser}
      profileAlt={`${possessive} profile picture`}
    />
  )

  return (
    <main className="flex flex-col items-center gap-8">
      <h1>{`${possessive} Profile`}</h1>
      <section>
        {isSelfProfile ? (
          <ProfileForm user={profileUser} profileView={profileView} />
        ) : (
          profileView
        )}
      </section>
      <section className="flex w-full flex-col gap-4">
        <RedirectSearchbar
          searchItemName="meme"
          redirectPath="/memes"
          moreSearchParams={{ "user-id": profileUser.id }}
        />
        <TabbedUserMemeView
          userId={profileUser.id}
          query={null}
          includePrivateMemes={isSelfProfile}
        />
      </section>
    </main>
  )
}
