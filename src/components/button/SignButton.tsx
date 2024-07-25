'use client'

import { signIn, signOut } from "next-auth/react"

type SignButtonProps = {
    type: 'in' | 'out'
}

export function SignButton({ type }: SignButtonProps) {    
    let action = () => signIn()
    let label = 'Sign In'
    let className = 'btn-primary'

    if (type === 'out') {
        action = () => signOut()
        label = 'Sign Out'
        className = 'btn-secondary'
    }
    
    return (
        <button
            type='button'
            className={className}
            onClick={action}
        >
            {label}
        </button>
    )
}