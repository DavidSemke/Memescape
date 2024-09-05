'use client'

import { FaceFrownIcon } from "@heroicons/react/24/outline"

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
 
  return (
    <main className="grow flex flex-col items-center justify-center gap-8 pb-32 text-center">
        <FaceFrownIcon className="w-16 h-16" /> 
        <h1>Something went wrong!</h1>
        <p className="text-xl">{error.message}</p>
        <button
            className="btn-primary"
            onClick={() => reset()}
        >
            Try again
        </button>
    </main>
  )
}