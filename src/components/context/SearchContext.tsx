'use client'
 
import { createContext, SetStateAction } from 'react'
import { useState } from 'react'

export const SearchbarContext = createContext({
    showSearchbarButton: false,
    setShowSearchbarButton: (update: SetStateAction<boolean>) => {},
    showSearchbar: true,
    setShowSearchbar: (update: SetStateAction<boolean>) => {},
})
 
export function SearchbarProvider({
  children,
}: {
  children: React.ReactNode
}) {
    const [showSearchbarButton, setShowSearchbarButton] = useState<boolean>(false)
    const [showSearchbar, setShowSearchbar] = useState<boolean>(true)

    return (
        <SearchbarContext.Provider value={{ 
            showSearchbarButton, 
            setShowSearchbarButton,
            showSearchbar, 
            setShowSearchbar 
        }}>
            {children}
        </SearchbarContext.Provider>
    )
}