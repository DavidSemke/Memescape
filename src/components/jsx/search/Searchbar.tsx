'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { MutableRefObject } from "react"
import { useDebouncedCallback } from "use-debounce"
import { attrsStyleMerge } from "@/components/utils"

type SearchbarProps = {
    searchItemName: string,
    onSearch: (input: string) => void,
    defaultValue?: string,
    searchbarRef?: MutableRefObject<HTMLDivElement | null>,
    inputRef?: MutableRefObject<HTMLInputElement | null>,
    attrs?: {
        root?: Record<string, any>,
        icon?: Record<string, any>,
        input?: Record<string, any>
    }
}

export default function Searchbar({
    searchItemName, onSearch, defaultValue, searchbarRef, inputRef, attrs={}
}: SearchbarProps) {
    const defaultStyles = {
        root: 'flex gap-2 items-center relative w-full z-10 rounded-2xl bg-action-secondary border-2 border-stress-secondary',
        icon: 'w-6 h-6 absolute left-3',
        input: 'pl-12 bg-gone rounded-2xl border-none w-full focus:outline-none focus:ring-stress-primary focus:ring-4'
    }
    const styles = attrsStyleMerge(attrs, defaultStyles)

    const cappedSearchItemName = (
        searchItemName[0].toUpperCase() + searchItemName.slice(1)
    )

    const debouncedSearch = useDebouncedCallback(onSearch, 500)
    
    return (
        <div
            {...attrs.root}
            role='search'
            ref={searchbarRef}
            className={styles.root}
        >
            <MagnifyingGlassIcon
                {...attrs.icon}
                className={styles.icon}
            />
            <input
                {...attrs.input}
                ref={inputRef}
                aria-label={`${cappedSearchItemName} Searchbar`}
                type='search'
                placeholder={`Search for ${searchItemName}`}
                className={styles.input}
                onChange={(e) => debouncedSearch(e.target.value)}
                defaultValue={defaultValue}
            />
        </div>
    )
}