'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { SidebarContext } from '../context/SidebarContext'
import { SignButton } from '../button/SignButton'
import { useContext, useEffect } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'

type SidebarProps = {
    session: Session | null
}

export default function Sidebar({ session }: SidebarProps) {
    const { showSidebar, setShowSidebar } = useContext(SidebarContext)
    const pathname = usePathname()
    const user = session?.user
    const profileImageSrc = user?.profile_image?.base64
    const links = {
        userProfile: user ? `/${user.name}` : undefined,
        userMemes: user ? `/${user.name}/memes` : undefined,
        findMemes: '/memes',
        createMeme: user ? `/${user.name}/memes/create` : undefined
    }

    useEffect(() => {
        setShowSidebar(false)
    }, [pathname])

    return (
        <nav className={clsx(
            'flex flex-col items-center gap-4 p-4 fixed z-10 bg-primary w-full h-full ease-in-out duration-300',
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
                        />
                    ) : (
                        <UserCircleIcon 
                            className='w-12 h-12'
                        />
                    )
                }
                <div className='text-lg'>
                    { user ? user.name : 'Anonymous' }
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
                    <section className='flex flex-col gap-4 items-center w-full'>
                        <p className="text-center">
                            Start creating memes today!
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
                user && (
                    <SignButton type='out'/>
                ) 
            }
        </nav>
    )
}