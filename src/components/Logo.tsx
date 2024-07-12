import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

type LogoProps = {
    title?: boolean,
    slogan?: boolean,
    attrs?: {
        root?: {
            [key: string]: any
        },
        title?: {
            [key: string]: any
        },
        slogan?: {
            [key: string]: any
        }
    }
}

export default function Logo({ title=false, slogan=false, attrs={} }: LogoProps) {
    const defaultStyles = {
        root: 'flex items-center gap-2',
        title: 'text-lg',
        slogan: 'text-sm'
    }
    const els = ['root', 'title', 'slogan'] as const;

    const [rootClasses, titleClasses, sloganClasses] = els.map((el) => {
        return clsx(
            defaultStyles[el],
            attrs[el]?.className
        )
    })

    return (
        <div {...attrs.root} className={rootClasses}>
            <Link href='/'>
                <div className='rounded-full overflow-hidden'>
                    <Image 
                        src='/logo.png'
                        width={56} 
                        height={56}
                        alt='Memescape home.'
                    />
                </div>
            </Link>
            {
                (title || slogan) && (
                    <div className='flex flex-col justify-center'>
                        {   
                            title && (
                                <div {...attrs.title} className={titleClasses}>
                                    Memescape
                                </div>
                            )
                        }
                        {
                            slogan && (
                                <p {...attrs.slogan} className={sloganClasses}>
                                    Find memes, create memes, share memes.
                                </p>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}