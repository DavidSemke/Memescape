"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react"

type ContextType = {
  openModalId: string | null
  setOpenModalId: Dispatch<SetStateAction<string | null>>
}

export const ModalContext = createContext<ContextType>({
  openModalId: null,
  setOpenModalId: (update: SetStateAction<string | null>) => {},
})

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openModalId, setOpenModalId] = useState<string | null>(null)

  return (
    <ModalContext.Provider
      value={{
        openModalId,
        setOpenModalId,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
