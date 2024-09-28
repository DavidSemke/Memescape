import Link from "next/link"
import { FaceFrownIcon } from "@heroicons/react/24/outline"

type NotFoundViewProps = {
  resourceName: string
}

export default function NotFoundView({ resourceName }: NotFoundViewProps) {
  return (
    <main className="grow justify-center pb-32 text-center">
      <FaceFrownIcon className="h-16 w-16" />
      <h1>404 - Not Found</h1>
      <p className="text-xl">
        The {resourceName} you are looking for does not exist.
      </p>
      <Link href="/">Return Home</Link>
    </main>
  )
}
