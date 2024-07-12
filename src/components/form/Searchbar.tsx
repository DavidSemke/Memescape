import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type SearchbarProps = {
    placeholder: string,
}

export default function Searchbar({ placeholder }: SearchbarProps) {
    return (
        <div className='relative flex gap-2 items-center mx-4 rounded-2xl bg-action-secondary border-2 border-stress-secondary w-full'>
            <MagnifyingGlassIcon 
                className='w-6 h-6 absolute left-2'
            />
            <input 
                name='content'
                type='text'
                placeholder={placeholder}
                className='pl-12 input-bg-none rounded-2xl border-none w-full focus:outline-none focus:ring-4 focus:ring-stress-primary'
            />
        </div>
    )
}