import RedirectSearchbar from "@/components/search/RedirectSearchbar";
import ShallowMemeGrid from "@/components/grid/ShallowMemeGrid";
import { SignButton } from "@/components/button/SignButton";
import Link from "next/link";
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { Suspense } from "react";
import Ellipsis from "@/components/loading/Ellipsis";

export default async function IndexPage() {
  const session = await auth()
  const user = session?.user

  return (
    <main className="flex flex-col gap-4 items-center">
      <RedirectSearchbar 
        placeholder="Search memes"
        redirectPath="/memes"
      />
      <h1>Hot Memes</h1>
      <Suspense fallback={<Ellipsis />}>
        <ShallowMemeGrid />
      </Suspense>
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
