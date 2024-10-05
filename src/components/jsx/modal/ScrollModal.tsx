"use client"

import { useRef } from "react"
import useContainerHeight from "@/components/hooks/useContainerHeight"
import Modal from "./Modal"
import clsx from "clsx"

type ScrollModalProps = {
  title: string
  onCancel: () => void
  onConfirm: () => void
  downloadData?: {
    href: string
    name: string
  }
  prefixedChildren: React.ReactNode
  children: React.ReactNode
}

/*
    Prefixed children are children that come before the scrollable view.
    Children are placed in scrollable view.
*/
export function ScrollModal({
  title,
  onCancel,
  onConfirm,
  downloadData,
  prefixedChildren,
  children,
}: ScrollModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const buttonContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerHeight = useContainerHeight(
    scrollContainerRef,
    buttonContainerRef,
  )

  return (
    <Modal
      title={title}
      onCancel={onCancel}
      onConfirm={onConfirm}
      downloadData={downloadData}
      buttonContainerRef={buttonContainerRef}
    >
      {prefixedChildren}
      <div
        ref={scrollContainerRef}
        className={clsx(
          "w-full overflow-y-auto border-2 border-stress-secondary",
          {
            grow: scrollContainerHeight === null,
          },
        )}
        style={{
          height:
            scrollContainerHeight !== null
              ? `${scrollContainerHeight}px`
              : "auto",
        }}
      >
        {children}
      </div>
    </Modal>
  )
}
