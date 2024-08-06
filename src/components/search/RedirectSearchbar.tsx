'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Searchbar from './Searchbar'

type RedirectSearchbarProps = {
    placeholder: string,
    redirectPath: string
}

export default function RedirectSearchbar({ 
    placeholder, redirectPath 
}: RedirectSearchbarProps) {
    const searchParams = useSearchParams()
    const { push } = useRouter()
    const onSearch = (input: string) => {
        const params = new URLSearchParams(searchParams)
        input = input.trim()

        if (input !== '') {
            params.set('query', input)
        }
        else {
            params.delete('query')
        }

        push(`${redirectPath}?${params.toString()}`)
    }

    return (
        <Searchbar 
            placeholder={placeholder}
            onSearch={onSearch}
        />
    )
}