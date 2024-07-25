import Searchbar from "@/components/form/Searchbar";
import ImageGrid from "@/components/grid/ImageGrid";
import { SignButton } from "@/components/button/SignButton";
import Link from "next/link";
import { auth } from "@/app/api/auth/[...nextauth]/auth"

export default async function IndexPage() {
  const session = await auth()
  const user = session?.user

  return (
    <main className="flex flex-col gap-4 items-center min-h-screen p-4">
      <Searchbar 
        placeholder="Search for memes"
      />
      <ImageGrid 
        images={[]}
      />
      <div className="flex flex-col items-center gap-4">
        {
          user ? (
            <>
              <p className="text-center">
                Have an idea for a meme?
              </p>
                <Link 
                  href={`/${user.name}/memes/create`} 
                  className="btn-secondary"
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
