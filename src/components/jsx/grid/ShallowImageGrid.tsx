import { ProcessedImage } from "@/data/api/types/model/types"
import ImageGrid from "./ImageGrid"

type ShallowImageGridProps = {
  fetchAction: (page: number, pageSize: number) => Promise<ProcessedImage[]>
  pageSize: number
  linkRoot?: string
  onImageClick?: (image: ProcessedImage) => void
  maxColumnCount?: 2 | 3 | 4
}

/*
    Shows up to one page's worth of images in a grid.
    Meant to be used as a wrapper for <Suspense>
    The async fetch cannot occur in the ImageGrid component to solve this 
    because of its involvement with the DeepImageGrid.
*/
export default async function ShallowImageGrid({
  fetchAction,
  pageSize,
  linkRoot,
  onImageClick,
  maxColumnCount = 4,
}: ShallowImageGridProps) {
  const images = await fetchAction(1, pageSize)

  return (
    <ImageGrid
      imageGroups={[images]}
      linkRoot={linkRoot}
      onImageClick={onImageClick}
      maxColumnCount={maxColumnCount}
    />
  )
}
