'use client'

import clsx from 'clsx'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useContext } from 'react'
import { SearchbarContext } from '../context/SearchContext'
import { useDebouncedCallback } from 'use-debounce'

type SearchbarProps = {
    placeholder: string,
}

export default function Searchbar({ placeholder }: SearchbarProps) {
    const { 
        showSearchbar, 
        setShowSearchbar,
        setShowSearchbarButton
    } = useContext(SearchbarContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const onScroll = useDebouncedCallback(() => {
        if (window.scrollY === 0) {
            setShowSearchbarButton(false)
            setShowSearchbar(true)
        }
        else {
            setShowSearchbarButton(true)
            
            if (!inputRef.current?.value) {
                setShowSearchbar(false)
            }
        }
    }, 300)

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        
        return () => {
          window.removeEventListener('scroll', onScroll);
          setShowSearchbar(true)
          setShowSearchbarButton(false)
        }
    }, []);

    return (
        <div
            role='search'
            className={clsx(
                'sticky top-[calc(max(var(--h-topbar),var(--min-h-topbar))+1rem)]',
                'flex gap-2 items-center w-full',
                'rounded-2xl bg-action-secondary border-2 border-stress-secondary',
                'ease-in-out duration-300',
                {
                    'translate-y-0': showSearchbar,
                    '-translate-y-[100vh]': !showSearchbar
                }
            )}
        >
            <MagnifyingGlassIcon 
                className='w-6 h-6 absolute left-3'
            />
            <input 
                ref={inputRef}
                aria-label='Meme searchbar'
                type='search'
                placeholder={placeholder}
                className={clsx(
                    'pl-12 bg-gone rounded-2xl border-none w-full focus:outline-none focus:ring-stress-primary',
                    {
                        'focus:ring-4': showSearchbar,
                        'focus:ring-0': !showSearchbar
                    }
                )}
            />
        </div>
    )
}