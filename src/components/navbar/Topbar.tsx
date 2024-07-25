'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'
import Logo from '../image/Logo'
import { SidebarContext } from '../context/SidebarContext'
import { SignButton } from '../button/SignButton'
import { useContext } from 'react'
import Link from 'next/link'
import { Session } from 'next-auth'

type TopbarProps = {
    session: Session | null
}

export default function Topbar({ session }: TopbarProps) {
    const { setShowSidebar } = useContext(SidebarContext)
    const user = session?.user

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
                    user ? (
                        <Link 
                            href={`/${user.name}/memes/create`} 
                            className='btn-primary'
                        >
                            Create
                        </Link>
                    ) : <SignButton type='in'/> 
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