import { auth } from "@/app/api/auth/[...nextauth]/auth";
import ProfileForm from "@/components/form/ProfileForm";
import { getOneUser } from "@/data/api/controllers/user";
import { NestedUser } from "@/data/api/types/model/types";
import { notFound } from "next/navigation";
import { getBookmarks } from "@/data/api/controllers/bookmark";
import { getMemes } from "@/data/api/controllers/meme";
import ProfileView from "@/components/view/ProfileView";
import TabbedMemeGrid from "@/components/grid/TabbedGrid";
import DeepMemeGrid, { DeepMemeGridFetchAction } from "@/components/grid/DeepMemeGrid";
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
    const fetchActions: DeepMemeGridFetchAction[] = [
        async (query, page, pageSize) => {
            'use server'
            return await getMemes(query, page, pageSize, profileUser.id)
        }
    ]
    const initMemesPromises = [
        fetchActions[fetchActions.length-1](null, 1, tabPageSize)
    ]

    if (isSelfProfile) {
        fetchActions.push(async (query, page, pageSize) => {
            'use server'
            const bookmarks = await getBookmarks(
                query, page, pageSize, profileUser.id
            )
            return bookmarks.map(b => {
                const nestedMeme = b.meme

                if (!nestedMeme) {
                    throw new Error('Nested bookmark lacks data.')
                }

                return nestedMeme
            })
        })
        initMemesPromises.push(
            fetchActions[fetchActions.length-1](null, 1, tabPageSize)
        )
    }

    const initMemes = await Promise.all(initMemesPromises)
    const tabs = ['Memes', 'Bookmarks'].map((title, index) => {
        return {
            title,
            grid: (
                <DeepMemeGrid 
                    fetchAction={fetchActions[index]}
                    query={null}
                    pageSize={tabPageSize}
                    initMemes={initMemes[index]}
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
                <TabbedMemeGrid 
                    tabs={tabs}
                />
            </section>
        </main>
    )
}