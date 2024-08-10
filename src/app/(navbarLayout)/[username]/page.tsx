import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { getUserBookmarks } from "@/data/api/controllers/bookmark";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default async function ProfilePage() {
    const session = await auth()
    const sessionUser = session?.user

    if (!sessionUser) {
        throw new Error('Anonymous user accessed profile page')
    }

  return (
    <main>
        <h1>Your Profile</h1>
        <section>
            <form 
                method='post'
                className="hidden"
            >
                <div>
                    <label htmlFor="profile-pic">Profile Picture</label>
                    <input id="profile-pic" name="profile-pic" type="file" />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" />
                </div>
                <button type='submit' className="btn-secondary">Submit</button>                    
            </form>
            <div className="flex gap-4 justify-center">
                <UserCircleIcon 
                    className="w-16 h-16"
                />
                <div className="text-2xl">Username</div>
            </div>
            <button type='button' className="btn-secondary">Edit</button>
        </section>
        <section>
            Insert tab container for created, bookmarked, and templates
        </section>
    </main>
  )
}