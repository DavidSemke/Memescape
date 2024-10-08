"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ProcessedImage } from "@/data/api/types/model/types"
import { ScrollModal } from "../ScrollModal"
import { generateMemeImage } from "@/data/api/controllers/meme"
import Ellipsis from "../../loading/Ellipsis"

type CreateMemeModalProps = {
  lineCount: number
  formData: FormData
  onCancel: () => void
  onConfirm: () => void
  download?: boolean
}

/*
    Assumes that formData is validated.
    Param lineCount is the number of lines the chosen template uses.
    Form fields names use this number, so it is not included as form input.
*/
export function CreateMemeModal({
  lineCount,
  formData,
  onCancel,
  onConfirm,
  download = false,
}: CreateMemeModalProps) {
  const [memeImage, setMemeImage] = useState<ProcessedImage | null>(null)

  useEffect(() => {
    let isMounted = true
    loadData()

    async function loadData() {
      const text: string[] = []

      for (let i = 1; i < lineCount + 1; i++) {
        text.push(formData.get(`line${i}`) as string)
      }

      const image = await generateMemeImage(
        formData.get("template-id") as string,
        text,
      )

      if (!isMounted) {
        return
      }

      setMemeImage(image)
    }

    return () => {
      isMounted = false
    }
  }, [])

  // Some form inputs like 'private' which decides whether
  // a meme is visible to others are only options if user
  // is signed in.
  // If 'user-id' is null, user is not signed in.
  const userId = formData.get("user-id")

  const title = `${download ? "Download" : "Create"} this Meme?`
  let downloadData = undefined

  if (download && memeImage) {
    downloadData = {
      href: memeImage.base64,
      name: memeImage.downloadName!,
    }
  }

  return (
    <ScrollModal
      title={title}
      onCancel={onCancel}
      onConfirm={onConfirm}
      downloadData={downloadData}
      prefixedChildren={null}
    >
      <div className="flex w-full flex-col items-center gap-4">
        {memeImage ? (
          <Image
            src={memeImage.base64}
            width={0}
            height={0}
            alt={memeImage.alt}
            className="w-full border-2 border-stress-secondary"
          />
        ) : (
          <Ellipsis />
        )}
        {userId !== null && (
          <div className="flex w-full items-center gap-2 pl-4">
            <div className="font-semibold">Private:</div>
            <div>{formData.get("private") === "private" ? "Yes" : "No"}</div>
          </div>
        )}
      </div>
    </ScrollModal>
  )
}
