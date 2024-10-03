'use client'

import { MutableRefObject, useEffect } from "react"
import { createPortal } from "react-dom"
import XButton from "../button/XButton"
import CheckButton from "../button/CheckButton"
import DownloadButton from "../button/DownloadButton"

type ModalProps = {
  title: string
  onCancel: () => void
  onConfirm: () => void
  downloadData?: {
    href: string,
    name: string
  }
  buttonContainerRef?: MutableRefObject<HTMLDivElement | null>
  children: React.ReactNode
}

/* 
  Made to close on ESC press.
  Open/closed state managed in parent component.
*/
export default function Modal({
  title,
  onCancel,
  onConfirm,
  downloadData,
  buttonContainerRef,
  children,
}: ModalProps) {
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onEscape)

    return () => {
      window.removeEventListener("keydown", onEscape)
    }
  }, [])

  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 animate-fadeIn bg-overlay">
      <div
        role="dialog"
        aria-label={title}
        className="column-view absolute left-1/2 top-1/2 flex h-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 overflow-hidden border-2 border-stress-tertiary bg-tertiary p-4"
      >
        <div className="column-view flex grow flex-col items-center gap-4">
          <h2>{title}</h2>
          {children}
        </div>
        <div
          ref={buttonContainerRef}
          className="absolute bottom-0 flex w-full justify-around p-4"
        >
          <XButton onClick={onCancel} />
          {
            downloadData ? (
              <DownloadButton
                label="Confirm" 
                href={downloadData.href}
                downloadName={downloadData.name}
                onClick={onConfirm}
              />
            ) : (
              <CheckButton onClick={onConfirm} />
            )
          }
        </div>
      </div>
    </div>,
    document.body,
  )
}
