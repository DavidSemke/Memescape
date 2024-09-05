"use client"

import { ProcessedImage } from "@/data/api/types/model/types"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type ImageGridProps = {
  imageGroups: ProcessedImage[][]
  linkRoot?: string
  onImageClick?: (image: ProcessedImage) => void
  maxColumnCount?: 2 | 3 | 4
}

export default function ImageGrid({
  imageGroups,
  linkRoot = undefined,
  onImageClick = undefined,
  maxColumnCount = 4,
}: ImageGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  imageGroups = imageGroups.filter((group) => group.length !== 0)

  return (
    <div>
      {imageGroups.map((group: ProcessedImage[]) => (
        <div
          key={group[0].id}
          className={clsx(
            "mt-4 w-full gap-4 border-b-2 border-stress-secondary pb-4 first:mt-0 last:border-none last:pb-0",
            {
              "columns-2": maxColumnCount === 2,
              "multi-column-view-3": maxColumnCount === 3,
              "multi-column-view-4": maxColumnCount === 4,
            },
          )}
        >
          {group.map((image) => {
            const renderedImage = (
              <Image
                src={image.base64}
                width={0}
                height={0}
                alt={image.alt}
                className={clsx("w-full", {
                  "border-4 border-stress-primary": image.id === selectedId,
                  "border-2 border-stress-secondary": image.id !== selectedId,
                })}
              />
            )

            return (
              <div
                key={image.id}
                className="mb-4"
                onClick={() => {
                  setSelectedId(image.id)

                  if (onImageClick) {
                    onImageClick(image)
                  }
                }}
              >
                {linkRoot !== undefined && image.linkId !== undefined ? (
                  <Link href={`${linkRoot}/${image.linkId}`}>
                    {renderedImage}
                  </Link>
                ) : (
                  renderedImage
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
