import Image from 'next/image'
import Link from 'next/link'
import { attrsStyleMerge } from '../utils'

type LogoProps = {
    title?: boolean,
    slogan?: boolean,
    attrs?: {
        root?: Record<string, any>,
        title?: Record<string, any>,
        slogan?: Record<string, any>
    }
}

export default function Logo({ title=false, slogan=false, attrs={} }: LogoProps) {
    const defaultStyles = {
        root: 'flex items-center gap-2',
        title: 'text-lg',
        slogan: 'text-sm'
    }
    const styles = attrsStyleMerge(attrs, defaultStyles)

    return (
        <div {...attrs.root} className={styles.root}>
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
                                <div {...attrs.title} className={styles.title}>
                                    Memescape
                                </div>
                            )
                        }
                        {
                            slogan && (
                                <p {...attrs.slogan} className={styles.slogan}>
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