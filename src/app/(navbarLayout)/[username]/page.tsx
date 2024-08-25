import { auth } from "@/app/api/auth/[...nextauth]/auth";
import ProfileForm from "@/components/form/ProfileForm";
import { getOneUser } from "@/data/api/controllers/user";
import { NestedUser } from "@/data/api/types/model/types";
import { notFound } from "next/navigation";
import { getBookmarks } from "@/data/api/controllers/bookmark";
import { getMemes } from "@/data/api/controllers/meme";
import ProfileView from "@/components/view/ProfileView";
import TabbedView from "@/components/view/TabbedView";
import DeepImageGrid, { DeepImageGridFetchAction } from "@/components/grid/DeepImageGrid";
import RedirectSearchbar from "@/components/search/RedirectSearchbar";

export default async function ProfilePage({ params }: { params: { username: string }}) {
    const session = await auth()
    const sessionUser = session?.user
    let fullSessionUser = null

    if (sessionUser) {
        fullSessionUser = await getOneUser(
            sessionUser.id, undefined, true
        )
    }

    let isSelfProfile = false
    let profileUser: NestedUser | null = null
    let possessive: string | null = null

    if (fullSessionUser && fullSessionUser.name === params.username) {
        profileUser = fullSessionUser
        isSelfProfile = true
        possessive = 'Your'
    }
    else {
        profileUser = await getOneUser(
            undefined, params.username, true
        )

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

    const tabPageSize = 10
    const fetchActions: DeepImageGridFetchAction[] = [
        async (query, page, pageSize) => {
            'use server'
            
            const memes = await getMemes(
                query, page, pageSize, profileUser.id
            )

            return memes.map(meme => { 
                if (!meme.product_image) {
                    throw new Error('Meme lacks image data.')
                }

                return meme.product_image 
            })
        }
    ]

    if (isSelfProfile) {
        fetchActions.push(async (query, page, pageSize) => {
            'use server'

            const bookmarks = await getBookmarks(
                query, page, pageSize, profileUser.id
            )

            return bookmarks.map(bookmark => { 
                if (!bookmark.meme?.product_image) {
                    throw new Error('Bookmark lacks image data.')
                }

                return bookmark.meme.product_image 
            })
        })
    }

    const initImages = await Promise.all(
        fetchActions.map(action => action(null, 1, tabPageSize))
    )
    const tabs = ['Memes', 'Bookmarks'].map((title, index) => {
        return {
            title,
            view: (
                <DeepImageGrid 
                    initImages={initImages[index]}
                    fetchAction={fetchActions[index]}
                    query={null}
                    pageSize={tabPageSize}
                    linkRoot='/memes'
                />
            )
        }
    })

    return (
        <main className="flex flex-col items-center gap-4">
            <h1>{`${possessive} Profile`}</h1>
            <section>
                {
                    isSelfProfile? (
                        <ProfileForm 
                            user={profileUser}
                            profileView={profileView}
                        /> 
                    ) : (
                        profileView
                    )
                }
            </section>
            <section className="flex flex-col gap-4 w-full">
                <RedirectSearchbar 
                    searchItemName="meme"
                    redirectPath="/memes"
                />
                <TabbedView 
                    tabs={tabs}
                />
            </section>
        </main>
    )
}