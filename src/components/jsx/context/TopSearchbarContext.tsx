'use client'
 
import { createContext, SetStateAction } from 'react'
import { useState } from 'react'

export const TopSearchbarContext = createContext({
    showTopSearchbarButton: false,
    setShowTopSearchbarButton: (update: SetStateAction<boolean>) => {},
    showTopSearchbar: true,
    setShowTopSearchbar: (update: SetStateAction<boolean>) => {},
})
 
export function TopSearchbarProvider({
  children,
}: {
  children: React.ReactNode
}) {
    const [
        showTopSearchbarButton, 
        setShowTopSearchbarButton
    ] = useState<boolean>(false)
    const [
        showTopSearchbar, 
        setShowTopSearchbar
    ] = useState<boolean>(true)

    return (
        <TopSearchbarContext.Provider value={{ 
            showTopSearchbarButton, 
            setShowTopSearchbarButton,
            showTopSearchbar, 
            setShowTopSearchbar 
        }}>
            {children}
        </TopSearchbarContext.Provider>
    )
}