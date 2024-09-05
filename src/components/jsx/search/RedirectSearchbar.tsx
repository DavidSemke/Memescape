"use client"

import { useSearchParams, useRouter } from "next/navigation"
import TopSearchbar from "./TopSearchbar"

type RedirectSearchbarProps = {
  searchItemName: string
  redirectPath: string
  moreSearchParams?: Record<string, string>
}

export default function RedirectSearchbar({
  searchItemName,
  redirectPath,
  moreSearchParams,
}: RedirectSearchbarProps) {
  const searchParams = useSearchParams()
  const { push } = useRouter()
  const onSearch = (input: string) => {
    const params = new URLSearchParams(searchParams)
    input = input.trim()

    if (input !== "") {
      params.set("query", input)
    } else {
      params.delete("query")
    }

    if (moreSearchParams) {
      for (const param in moreSearchParams) {
        params.set(param, moreSearchParams[param])
      }
    }

    push(`${redirectPath}?${params.toString()}`)
  }

  return <TopSearchbar searchItemName={searchItemName} onSearch={onSearch} />
}
