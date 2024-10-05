"use client"

import { useContext, useEffect, useRef } from "react"
import { ModalContext } from "../context/ModalContext"

type InertableProps = {
  children: React.ReactNode
}

export default function Inertable({ children }: InertableProps) {
  const { openModalId } = useContext(ModalContext)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current

    if (root === null) {
        return
    }

    if (openModalId !== null) {
        root.setAttribute('inert', '')
    }
    else {
        root.removeAttribute('inert')
    }
  }, [openModalId])

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen w-full flex-col items-center"
    >
      {children}
    </div>
  )
}
