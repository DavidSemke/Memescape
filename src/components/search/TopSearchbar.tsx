'use client'

import clsx from 'clsx'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { 
    useEffect, 
    useRef, 
    useContext, 
    useLayoutEffect 
} from 'react'
import { TopSearchbarContext } from '../context/TopSearchbarContext'
import { useDebouncedCallback } from 'use-debounce'

type TopSearchbarProps = {
    searchItemName: string,
    defaultValue?: string | undefined,
    onSearch: (input: string) => void
}

/* 
    TopSearchbar activated by show/hide button in topbar when out of view.
    Param searchItemName is for the name of the items being searched.
    For example, searchItemName = 'meme'.
*/
export default function TopSearchbar({ 
    searchItemName, defaultValue=undefined, onSearch
}: TopSearchbarProps) {
    const { 
        showTopSearchbar, 
        setShowTopSearchbar,
        setShowTopSearchbarButton
    } = useContext(TopSearchbarContext)

    const searchbarRef = useRef<HTMLDivElement | null>(null)
    // Ref for the searchbar's top property on initial page load
    const searchbarInitTopRef = useRef<number | null>(null)
    // Ref for the searchbar's top property when sticky
    const searchbarStickyTopRef = useRef<number | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    /* Event Listeners */
    const onScroll = useDebouncedCallback(() => {
        if (
            searchbarRef.current === null
            || searchbarInitTopRef.current === null
        ) {
            return
        }

        if (searchbarStickyTopRef.current === null) {
            searchbarStickyTopRef.current = computeStickyTop(
                searchbarRef.current
            )
        }

        if (
            window.scrollY > (
                searchbarInitTopRef.current 
                - searchbarStickyTopRef.current
            )
        ) {
            // Searchbar has become sticky
            setShowTopSearchbarButton(true)
            
            if (!inputRef.current?.value) {
                setShowTopSearchbar(false)
            }
        }
        else {
            // Searchbar is no longer sticky
            setShowTopSearchbarButton(false)
            setShowTopSearchbar(true)
        }
    }, 300)

    const onResize = useDebouncedCallback(() => {
        if (searchbarRef.current === null) {
            return
        }

        // The top property of the searchbar changes for diff
        // screen sizes, so the style must be recomputed.
        searchbarStickyTopRef.current = computeStickyTop(
            searchbarRef.current
        )
    }, 1000)

    function computeStickyTop(searchbar: HTMLDivElement) {
        const style = window.getComputedStyle(searchbar);
        return parseInt(style.top, 10);
    }

    /* Effect Hooks */
    useLayoutEffect(() => {
        if (!searchbarRef.current) {
            return
        }

        searchbarInitTopRef.current = (
            searchbarRef.current.getBoundingClientRect().top
        )
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize)
        
        return () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize)
          setShowTopSearchbar(true)
          setShowTopSearchbarButton(false)
        }
    }, []);

    const cappedSearchItemName = (
        searchItemName[0].toUpperCase() + searchItemName.slice(1)
    )
    const debouncedSearch = useDebouncedCallback(onSearch, 500)

    return (
        <div
            role='search'
            ref={searchbarRef}
            className={clsx(
                'sticky top-[calc(max(var(--h-topbar),var(--min-h-topbar))+1rem)]',
                'flex gap-2 items-center w-full',
                'rounded-2xl bg-action-secondary border-2 border-stress-secondary',
                'ease-in-out duration-300',
                {
                    'translate-y-0': showTopSearchbar,
                    '-translate-y-[100vh]': !showTopSearchbar
                }
            )}
        >
            <MagnifyingGlassIcon 
                className='w-6 h-6 absolute left-3'
            />
            <input 
                ref={inputRef}
                aria-label={`${cappedSearchItemName} Searchbar`}
                type='search'
                placeholder={`Search for ${searchItemName}`}
                className={clsx(
                    'pl-12 bg-gone rounded-2xl border-none w-full focus:outline-none focus:ring-stress-primary',
                    {
                        'focus:ring-4': showTopSearchbar,
                        'focus:ring-0': !showTopSearchbar
                    }
                )}
                onChange={(e) => debouncedSearch(e.target.value)}
                defaultValue={defaultValue}
            />
        </div>
    )
}