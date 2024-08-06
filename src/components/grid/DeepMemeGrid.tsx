'use client'

import { useState, useEffect } from "react"
import MemeGrid from "./MemeGrid"
import { getMemes } from "@/data/api/controllers/meme"
import Ellipsis from "../loading/Ellipsis"
import { NestedMeme } from "@/data/api/types/model"

type DeepMemeGridProps = {
    query: string
}

/*
    Shows up to one page's worth of memes in a grid initially.
    Scrolling to the bottom reveals more memes if they exist.
    Memes shown are chosen using URL query.
*/
export default function DeepMemeGrid({ query }: DeepMemeGridProps) {
    const [memes, setMemes] = useState<NestedMeme[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
    // If more memes could exist on the next page, moreExist is true
    const [moreExist, setMoreExist] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    // Use prevQuery to determine if query has changed
    const [prevQuery, setPrevQuery] = useState<string | null>(null)
    const pageSize = 20

    useEffect(() => {
        let isMounted = true

        if (query.trim() !== '') {
            addMemes()
        }

        async function addMemes() {
            setIsLoadingMore(true)
            const memesToAdd = await getMemes(query, 1, pageSize)

            if (!isMounted) {
                return
            }

            setPage(1)
            setMoreExist(memesToAdd.length === pageSize)
            setMemes(memesToAdd)
            setIsLoadingMore(false)
            setPrevQuery(query)
        }
    
        return () => {
          isMounted = false
        }
    }, [query])

    async function addMemes() {
        setIsLoadingMore(true)
        const memesToAdd = await getMemes(query, page+1, pageSize)
        setPage(page => page + 1)
        setMoreExist(memesToAdd.length === pageSize)
        setMemes(memes => [...memes, ...memesToAdd])
        setIsLoadingMore(false)
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {
                prevQuery === query && (
                    <MemeGrid 
                        memes={memes}
                    />
                )
            }
            {
                isLoadingMore ? (
                    <Ellipsis />
                ) : (
                    moreExist ? (
                        <button
                            type='button'
                            className="btn-secondary"
                            onClick={() => {
                                addMemes()
                            }}
                        >
                            More
                        </button>
                    ) : (
                        memes.length > 0 && (
                            <p className="w-full text-center my-4">End of search results.</p>
                        )
                    )
                )
            }
        </div>
    )
}