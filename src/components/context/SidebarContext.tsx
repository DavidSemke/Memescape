'use client'
 
import { createContext, SetStateAction } from 'react'
import { useState } from 'react'

type ShowSidebarSetter = SetStateAction<boolean>

export const SidebarContext = createContext({
    showSidebar: false,
    setShowSidebar: (update: ShowSidebarSetter) => {},
})
 
export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    return (
        <SidebarContext.Provider value={{ 
            showSidebar, setShowSidebar 
        }}>
            {children}
        </SidebarContext.Provider>
    )
}