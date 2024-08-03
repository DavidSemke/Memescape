'use client'
 
import { createContext, SetStateAction } from 'react'
import { useState } from 'react'

export const SidebarContext = createContext({
    showSidebar: false,
    setShowSidebar: (update: SetStateAction<boolean>) => {},
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