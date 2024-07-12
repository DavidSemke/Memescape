'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { SidebarContext } from '../context/SidebarContext'
import { useContext } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const isSignedIn = false
    const { showSidebar } = useContext(SidebarContext)
    const pathname = usePathname()

    return (
        <nav className={clsx(
            'flex flex-col items-center gap-4 p-4 fixed z-10 bg-primary w-full h-full',
            {
                'hidden': !showSidebar
            }
        )}>
            <section className='flex items-center gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                {
                    isSignedIn ? (
                        // <Image 
                        //     src={???}
                        //     width={48}
                        //     height={48}
                        //     alt='Your profile picture.'
                        // />
                        null
                    ) : (
                        <UserCircleIcon 
                            className='w-12 h-12'
                        />
                    )
                }
                <div className='text-lg'>Username</div>
            </section>
            <section className='flex flex-col gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                <Link href='/'>Your Profile</Link>
                <Link href='/'>Your Memes</Link>
            </section>
            <section className='flex flex-col gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                <Link href='/'>Find Memes</Link>
                <Link href='/'>Create Meme</Link>
            </section>
                <Link href='/sign-out' className='btn-secondary'>Sign Out</Link>
        </nav>
    )
}