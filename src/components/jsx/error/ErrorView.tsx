"use client"

import { FaceFrownIcon } from "@heroicons/react/24/outline"

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="grow justify-center pb-32 text-center">
      <FaceFrownIcon className="h-16 w-16" />
      <h1>Something went wrong!</h1>
      <p className="text-xl">{error.message}</p>
      <button className="btn-primary" onClick={() => reset()}>
        Try again
      </button>
    </main>
  )
}
