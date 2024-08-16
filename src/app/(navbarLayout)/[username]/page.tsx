import { auth } from "@/app/api/auth/[...nextauth]/auth";
import ProfileForm from "@/components/form/ProfileForm";
import { getUserByName } from "@/data/api/controllers/user";
import { NestedUser } from "@/data/api/types/model/types";
import { notFound } from "next/navigation";
import { getBookmarks } from "@/data/api/controllers/bookmark";
import { getMemes } from "@/data/api/controllers/meme";
import ProfileView from "@/components/view/ProfileView";
import TabbedMemeGrid from "@/components/grid/TabbedGrid";
import DeepMemeGrid from "@/components/grid/DeepMemeGrid";
import RedirectSearchbar from "@/components/search/RedirectSearchbar";

export default async function ProfilePage({ params }: { params: { username: string }}) {
    const session = await auth()
    const sessionUser = session?.user
    let isSelfProfile = false
    let user: NestedUser | null = null
    let possessive: string | null = null

    if (sessionUser && sessionUser.name === params.username) {
        user = sessionUser
        isSelfProfile = true
        possessive = 'Your'
    }
    else {
        user = await getUserByName(params.username, true)

        if (user === null) {
            notFound()
        }

        possessive = `${user.name}'s`
    }
    
    const profileView = (
        <ProfileView 
            user={user} 
            profileAlt={`${possessive} profile picture`}
        />
    )
    const tabs = [
        {
            title: 'Memes',
            grid: (
                <DeepMemeGrid 
                    fetchAction={async (query, page, pageSize) => {
                        'use server'
                        return await getMemes(query, page, pageSize, user.id)
                    }}
                    query={null}
                    pageSize={10}
                />
            )
        },
    ]

    if (isSelfProfile) {
        tabs.push(
            {
                title: 'Bookmarks',
                grid: (
                    <DeepMemeGrid 
                        fetchAction={async (query, page, pageSize) => {
                            'use server'
                            const bookmarks = await getBookmarks(query, page, pageSize, user.id)
                            return bookmarks.map(b => {
                                const nestedMeme = b.meme

                                if (!nestedMeme) {
                                    throw new Error('Nested bookmark lacks data.')
                                }

                                return nestedMeme
                            })
                        }}
                        query={null}
                        pageSize={10}
                    />
                )
            }
        )
    }

    return (
        <main className="flex flex-col items-center gap-4">
            <h1>{`${possessive} Profile`}</h1>
            <section>
                {
                    isSelfProfile? (
                        <ProfileForm 
                            user={user}
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