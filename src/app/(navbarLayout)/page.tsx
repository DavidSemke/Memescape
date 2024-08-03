import Searchbar from "@/components/form/Searchbar";
import MemeGrid from "@/components/grid/MemeGrid"
import { SignButton } from "@/components/button/SignButton";
import Link from "next/link";
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { getMemes } from "@/data/api/controllers/meme";

export default async function IndexPage() {
  const [session, memes] = await Promise.all([
    auth(),
    getMemes(null, undefined, 10)
  ])
  const user = session?.user

  return (
    <main className="flex flex-col gap-4 items-center">
      <Searchbar 
        placeholder="Search memes"
      />
      <h1>Hot Memes</h1>
      <MemeGrid 
        memes={memes}
      />
      <div className="flex flex-col items-center gap-4 my-4">
        {
          user ? (
            <>
              <p className="text-center">
                Have an idea for a meme?
              </p>
                <Link 
                  href={`/${user.name}/memes/create`} 
                  className="btn-primary"
                >
                  Create
                </Link>
            </>
          ) : (
            <>
              <p className="text-center">
                Sign in to create memes!
              </p>
              <SignButton type='in'/>
            </>
          )
        }
      </div>
    </main>
  )
}
