'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { SidebarContext } from '../context/SidebarContext'
import { SignButton } from '../button/SignButton'
import { useContext } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { NestedUser } from '@/data/api/types/model/types'

type SidebarProps = {
    sessionUser: NestedUser | null
}

export default function Sidebar({ sessionUser }: SidebarProps) {
    const { showSidebar } = useContext(SidebarContext)
    const pathname = usePathname()
    const profileImageSrc = sessionUser?.profile_image?.base64
    const links = {
        userProfile: sessionUser ? `/${sessionUser.name}` : undefined,
        userMemes: sessionUser ? `/memes?user-id=${sessionUser.id}` : undefined,
        findMemes: '/memes',
        createMeme: '/memes/create'
    }

    return (
        <nav className={clsx(
            'flex flex-col items-center gap-4 p-4 fixed z-20 top-[max(var(--h-topbar),var(--min-h-topbar))] right-0 bg-primary w-full sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 h-full ease-in-out duration-300',
            {
                'translate-x-0': showSidebar,
                'translate-x-full': !showSidebar
            }
        )}>
            <section className='flex items-center gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                {
                    profileImageSrc ? (
                        <Image 
                            src={profileImageSrc}
                            width={48}
                            height={48}
                            alt='Your profile picture.'
                            className='rounded-full'
                        />
                    ) : (
                        <UserCircleIcon 
                            className='w-12 h-12'
                        />
                    )
                }
                <div className='text-lg'>
                    { sessionUser ? sessionUser.name : 'Anonymous' }
                </div>
            </section>
            {
                links.userProfile && links.userMemes ? (
                    <section className='flex flex-col gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                        <Link 
                            href={links.userProfile} 
                            className={clsx({
                                'underline': pathname === links.userProfile
                            })}
                        >
                            Your Profile
                        </Link>
                        <Link 
                            href={links.userMemes}
                            className={clsx({
                                'underline': pathname === links.userMemes
                            })}
                        >
                            Your Memes
                        </Link>
                    </section>
                ) : (
                    <section className='flex flex-col gap-4 items-center w-full pb-4 border-b-2 border-stress-secondary'>
                        <p className="text-center">
                            Do you want meme storage or for others to see your memes?
                        </p>
                        <Link 
                            href='/sign-up'
                            className='btn-primary'
                        >
                            Sign Up
                        </Link>
                    </section>
                )
            }
            {
                links.findMemes && links.createMeme && (
                    <section className='flex flex-col gap-4 w-full pb-4 border-b-2 border-stress-secondary'>
                        <Link 
                            href={links.findMemes}
                            className={clsx({
                                'underline': pathname === links.findMemes
                            })}
                        >
                            Find Memes
                        </Link>
                        <Link 
                            href={links.createMeme}
                            className={clsx({
                                'underline': pathname === links.createMeme
                            })}
                        >
                            Create Meme
                        </Link>
                    </section>
                )
            }
            {
                sessionUser && (
                    <SignButton type='out'/>
                ) 
            }
        </nav>
    )
}