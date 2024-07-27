import Image from "next/image"
import Link from "next/link"
import { NestedJoinedMeme } from "@/data/api/definitions"

type MemeGridProps = {
    memes: NestedJoinedMeme[]
}

export default function MemeGrid({ memes }: MemeGridProps) {
    return (
        <div className='columns-2 gap-4 w-full sm:columns-4 md:columns-4 lg:columns-6'>
            {
                memes.map((meme) => {
                    const { data, mime_type } = meme.product_image
                    const alt = `${meme.template.name}. ${meme.text.join('. ')}`

                    return (
                        <div 
                            key={meme.id} 
                            className="mb-4"
                        >
                            <Link 
                                href={`/memes/${meme.id}`}
                            >
                                <Image
                                    src={`data:${mime_type};base64,${data.toString('base64')}`}
                                    width={0}
                                    height={0}
                                    alt={alt}
                                    className="w-full border-2 border-stress-secondary"
                                />
                            </Link>
                        </div>
                    )
                    
                })
                    
            }
        </div>
    )
}