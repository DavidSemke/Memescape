'use client'
 
import { usePathname } from 'next/navigation'
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
    const [prevPathname, setPrevPathname] = useState<string | null>(null)
    const pathname = usePathname()

    if (prevPathname !== pathname) {
        setShowSidebar(false)
        setPrevPathname(pathname)
    }

    return (
        <SidebarContext.Provider value={{ 
            showSidebar, setShowSidebar 
        }}>
            {children}
        </SidebarContext.Provider>
    )
}