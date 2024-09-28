"use client"

import { useState, useEffect, useRef } from "react"
import ImageGrid from "../imageGrid/ImageGrid"
import Ellipsis from "../../loading/Ellipsis"
import { ProcessedImage } from "@/data/api/types/model/types"

export type DeepImageGridFetchAction = (
  query: string | null,
  page: number,
  pageSize: number,
) => Promise<ProcessedImage[]>

type FetchProps = {
  fetchAction: DeepImageGridFetchAction
  query: string | null
  pageSize: number
}

type DeepImageGridProps = FetchProps & {
  addInitImages?: boolean
  linkRoot?: string
  onImageClick?: (image: ProcessedImage) => void
  maxColumnCount?: 2 | 3 | 4
}

/*
    Shows up to one page's worth of images in a grid initially.
    Scrolling to the bottom and pressing button reveals more images.
*/
export default function DeepImageGrid({
  addInitImages = false,
  fetchAction,
  query = null,
  pageSize = 20,
  linkRoot,
  onImageClick,
  maxColumnCount = 4,
}: DeepImageGridProps) {
  const initRenderRef = useRef<boolean>(true)
  const pageRef = useRef<number>(1)
  const [imageGroups, setImageGroups] = useState<ProcessedImage[][]>([])
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  // If more images could exist on the next page, moreExist is true
  const [moreExist, setMoreExist] = useState<boolean>(false)
  // Query is always trimmed if able
  query &&= query.trim()
  const [prevFetchProps, setPrevFetchProps] = useState<FetchProps>({
    fetchAction,
    query,
    pageSize,
  })

  if (query === "" && query !== prevFetchProps.query) {
    pageRef.current = 1
    setMoreExist(false)
    setImageGroups([])
    setPrevFetchProps({ fetchAction, query, pageSize })
  }

  useEffect(() => {
    // Init memes are provided, so skip first activation
    if (initRenderRef.current) {
      initRenderRef.current = false

      if (!addInitImages) {
        return
      }
    }

    let isMounted = true

    if (query !== "") {
      addImages()
    }

    async function addImages() {
      setIsLoadingMore(true)
      pageRef.current = 1
      const imagesToStart = await fetchAction(query, pageRef.current, pageSize)

      if (!isMounted) {
        return
      }

      setMoreExist(imagesToStart.length === pageSize)
      setImageGroups([imagesToStart])
      setIsLoadingMore(false)
      setPrevFetchProps({ fetchAction, query, pageSize })
    }

    return () => {
      isMounted = false
    }
  }, [fetchAction, query, pageSize])

  async function addMoreImages() {
    setIsLoadingMore(true)
    pageRef.current += 1
    const imagesToAdd = await fetchAction(query, pageRef.current, pageSize)
    setMoreExist(imagesToAdd.length === pageSize)
    setImageGroups((groups) => [...groups, imagesToAdd])
    setIsLoadingMore(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {
        prevFetchProps.fetchAction === fetchAction &&
        prevFetchProps.query === query &&
        prevFetchProps.pageSize === pageSize && (
          <ImageGrid
            imageGroups={imageGroups}
            linkRoot={linkRoot}
            onImageClick={onImageClick}
            maxColumnCount={maxColumnCount}
          />
        )
      }
      {isLoadingMore ? (
        <Ellipsis />
      ) : moreExist ? (
        <button
          type="button"
          className="btn-secondary my-4 w-1/2"
          onClick={() => {
            addMoreImages()
          }}
        >
          More
        </button>
      ) : (
        imageGroups.length !== 0 &&
        imageGroups[0].length !== 0 && (
          <p className="my-4 w-full text-center">End of results.</p>
        )
      )}
    </div>
  )
}
