'use client'

import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline'
import Logo from '../Logo'
import { SidebarContext } from '../context/SidebarContext'
import { useContext } from 'react'
import Link from 'next/link'

export default function Topbar() {
    const isSignedIn = false
    const { setShowSidebar } = useContext(SidebarContext)

    return (
        <nav className='flex justify-between px-4 bg-primary h-10vh min-h-16 sticky top-0 z-10 border-b-2 border-stress-tertiary'>
            <div className='flex items-center gap-2'>
                <Logo 
                    title={true}
                    attrs={{
                        title: {
                            className: 'hidden sm:block'
                        }
                    }}
                />
            </div>
            <div className='flex items-center gap-4'>
                {
                    isSignedIn ? (
                        <Link href='/' className='btn-primary'>Create</Link>
                    ) : (
                        <Link href='/sign-in' className='btn-primary'>Sign In</Link>
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
                        className='w-8 h-8'
                    />
                </button>
            </div>
        </nav>
    )
}