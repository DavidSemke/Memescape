'use client'

import { useState, useEffect } from "react"
import MemeGrid from "./MemeGrid"
import Ellipsis from "../loading/Ellipsis"
import { NestedMeme } from "@/data/api/types/model/types"

export type DeepMemeGridProps = {
    fetchAction: (
        query: string | null, 
        page: number, 
        pageSize: number
    ) => Promise<NestedMeme[]>
    query: string | null,
    pageSize: number
}

/*
    Shows up to one page's worth of memes in a grid initially.
    Scrolling to the bottom and pressing button reveals more memes.
    Memes are chosen using URL query.
    <Suspense> is not necessary for this component.
    // Param relationUser is an object that contains a user id and a boolean, showBookmarks.
    // If showBookmarks is true, memes fetched will be bookmarked by user.
    // If showBookmarks is false, memes fetched will be created by user.
    // For no restrictions on fetched memes, omit relationUser.
*/
export default function DeepMemeGrid({ fetchAction, query=null, pageSize=20 }: DeepMemeGridProps) {
    const [memes, setMemes] = useState<NestedMeme[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
    // If more memes could exist on the next page, moreExist is true
    const [moreExist, setMoreExist] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [prevProps, setPrevProps] = useState<DeepMemeGridProps>({ fetchAction, query, pageSize })

    useEffect(() => {
        let isMounted = true

        if (query === null || query.trim() !== '') {
            addMemes()
        }

        async function addMemes() {
            setIsLoadingMore(true)
            const memesToAdd = await fetchAction(query, 1, pageSize)

            if (!isMounted) {
                return
            }

            setPage(1)
            setMoreExist(memesToAdd.length === pageSize)
            setMemes(memesToAdd)
            setIsLoadingMore(false)
            setPrevProps({ fetchAction, query, pageSize })
        }
    
        return () => {
          isMounted = false
        }
    }, [fetchAction, query, pageSize])

    async function addMoreMemes() {
        setIsLoadingMore(true)
        const memesToAdd = await fetchAction(query, page+1, pageSize)
        setPage(page => page + 1)
        setMoreExist(memesToAdd.length === pageSize)
        setMemes(memes => [...memes, ...memesToAdd])
        setIsLoadingMore(false)
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {
                (
                    prevProps.fetchAction === fetchAction
                    && prevProps.query === query
                    && prevProps.pageSize === pageSize
                ) && (
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
                                addMoreMemes()
                            }}
                        >
                            More
                        </button>
                    ) : (
                        memes.length > 0 && (
                            <p className="w-full text-center my-4">End of results.</p>
                        )
                    )
                )
            }
        </div>
    )
}