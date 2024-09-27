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
  initImages: ProcessedImage[]
  linkRoot?: string
  onImageClick?: (image: ProcessedImage) => void
  maxColumnCount?: 2 | 3 | 4
}

/*
    Shows up to one page's worth of images in a grid initially.
    Scrolling to the bottom and pressing button reveals more images.
    
    If initImages.length is:
    1 - Less than the given pageSize, it is assumed that there are 
    no more images to see.
    2 - More than the given pageSize, an error is thrown.
    
    It is assumed that fetchAction is used to produce initImages.
    The idea behind the initImages param is that sometimes an initial 
    fetch is not desired, such as when it is before a user has typed 
    in a search bar.
    In the future, it would be better to replace the initImages param 
    with a boolean to determine if an init fetch happens. 
*/
export default function DeepImageGrid({
  initImages,
  fetchAction,
  query = null,
  pageSize = 20,
  linkRoot,
  onImageClick,
  maxColumnCount = 4,
}: DeepImageGridProps) {
  if (initImages.length > pageSize) {
    throw new Error('Argument initImages has length that exceeds page size.')
  }

  const initRenderRef = useRef<boolean>(true)
  const pageRef = useRef<number>(1)
  const [imageGroups, setImageGroups] = useState<ProcessedImage[][]>([
    initImages,
  ])
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  // If more images could exist on the next page, moreExist is true
  const [moreExist, setMoreExist] = useState<boolean>(
    initImages.length === pageSize,
  )
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
      return
    }

    let isMounted = true

    if (query !== "") {
      initRenderRef.current = false
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
      {prevFetchProps.fetchAction === fetchAction &&
        prevFetchProps.query === query &&
        prevFetchProps.pageSize === pageSize && (
          <ImageGrid
            imageGroups={imageGroups}
            linkRoot={linkRoot}
            onImageClick={onImageClick}
            maxColumnCount={maxColumnCount}
          />
        )}
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
