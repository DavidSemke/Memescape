'use client'

import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Logo from '../image/Logo'
import { SidebarContext } from '../context/SidebarContext'
import { TopSearchbarContext } from '../context/TopSearchbarContext'
import { SignButton } from '../button/SignButton'
import { useContext } from 'react'
import { NestedUser } from '@/data/api/types/model/types'

type TopbarProps = {
    sessionUser: NestedUser | null
}

export default function Topbar({ sessionUser }: TopbarProps) {
    const { setShowSidebar } = useContext(SidebarContext)
    const { 
        showTopSearchbarButton, 
        setShowTopSearchbar 
    } = useContext(TopSearchbarContext)

    return (
        <nav className='flex justify-around p-2 bg-primary h-[--h-topbar] min-h-[--min-h-topbar] w-full sticky top-0 z-20 border-b-2 border-stress-tertiary'>
            <Logo 
                title={true}
                attrs={{
                    title: {
                        className: 'hidden sm:block'
                    }
                }}
            />
            <div className='flex items-center gap-4'>
                {
                    showTopSearchbarButton && (
                        <button
                            type='button'
                            aria-label='Search memes'
                            className='btn-secondary px-3 animate-bounce'
                            onClick={() => setShowTopSearchbar(bool => !bool)}
                        >
                            <MagnifyingGlassIcon 
                                className='w-6 h-6'
                            />
                        </button>
                    )
                }
                {
                    sessionUser === null && (
                        <SignButton type='in'/>
                    ) 
                }
                <button 
                    type='button' 
                    className='btn-secondary'
                    aria-label='Open sidebar.'
                    onClick={() => {
                        setShowSidebar((val) => !val)
                    }}
                >
                    <Bars3Icon 
                        className='w-6 h-6'
                    />
                </button>
            </div>
        </nav>
    )
}