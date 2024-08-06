'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Searchbar from './Searchbar'

type UrlSearchbarProps = {
    placeholder: string,
}

/*
    Uses the current url to store search state.
*/
export default function UrlSearchbar({ placeholder }: UrlSearchbarProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const onSearch = (input: string) => {
        const params = new URLSearchParams(searchParams)
        input = input.trim()

        if (input !== '') {
            params.set('query', input)
        }
        else {
            params.delete('query')
        }

        replace(`${pathname}?${params.toString()}`)
    }
    const defaultValue = searchParams.get('query')?.toString()

    return (
        <Searchbar 
            placeholder={placeholder}
            defaultValue={defaultValue}
            onSearch={onSearch}
        />
    )
}