import Searchbar from "@/components/form/Searchbar";
import ImageGrid from "@/components/ImageGrid";
import Link from "next/link";

export default function IndexPage() {
  const signedIn = true

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
          signedIn ? (
            <>
              <p className="text-center">
                Have an idea for a meme?
              </p>
                <Link href='/' className="btn-secondary">Create</Link>
            </>
          ) : (
            <>
              <p className="text-center">
                Sign in to create memes.
              </p>
                <Link href='/sign-in' className="btn-secondary">Sign In</Link>
            </>
          )
        }
      </div>
    </main>
  )
}
