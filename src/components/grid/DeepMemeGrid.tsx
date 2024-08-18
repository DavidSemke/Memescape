'use client'

import { useState, useEffect, useRef } from "react"
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
*/
export default function DeepMemeGrid({ 
    fetchAction, query=null, pageSize=20 
}: DeepMemeGridProps) {
    const pageRef = useRef<number>(1)
    const [memes, setMemes] = useState<NestedMeme[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
    // If more memes could exist on the next page, moreExist is true
    const [moreExist, setMoreExist] = useState<boolean>(false)
    // Query is always trimmed if able
    query = query !== null ? query.trim() : null 
    const [prevProps, setPrevProps] = useState<DeepMemeGridProps>(
        { fetchAction, query, pageSize }
    )

    if (query === '' && query !== prevProps.query) {
        pageRef.current = 1
        setMoreExist(false)
        setMemes([])
        setPrevProps({ fetchAction, query, pageSize })
    }

    useEffect(() => {
        let isMounted = true
        
        if (query !== '') {
            addMemes()
        }
        
        async function addMemes() {
            setIsLoadingMore(true)
            pageRef.current = 1
            const memesToStart = await fetchAction(
                query, pageRef.current, pageSize
            )

            if (!isMounted) {
                return
            }

            setMoreExist(memesToStart.length === pageSize)
            setMemes(memesToStart)
            setIsLoadingMore(false)
            setPrevProps({ fetchAction, query, pageSize })
        }
    
        return () => {
          isMounted = false
        }
    }, [fetchAction, query, pageSize])

    async function addMoreMemes() {
        setIsLoadingMore(true)
        pageRef.current += 1
        const memesToAdd = await fetchAction(
            query, pageRef.current, pageSize
        )
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