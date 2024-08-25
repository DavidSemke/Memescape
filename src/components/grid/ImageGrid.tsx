import { ProcessedImage } from "@/data/api/types/model/types"
import Image from "next/image"
import Link from "next/link"

type ImageGridProps = {
    imageGroups: ProcessedImage[][],
    linkRoot?: string,
    onImageClick?: (image: ProcessedImage) => void
}

export default function ImageGrid({ 
    imageGroups, 
    linkRoot=undefined, 
    onImageClick=undefined 
}: ImageGridProps) {
    imageGroups = imageGroups.filter(group => group.length !== 0)
    
    return (
        <div>
            { imageGroups.map((group: ProcessedImage[], index) => (
                <div 
                    key={group[index].id}
                    className='columns-2 gap-4 w-full pb-4 last:pb-0 mt-4 first:mt-0 border-b-2 border-stress-secondary last:border-none sm:columns-4 md:columns-5 lg:columns-6'
                >
                    { group.map((image) => {
                        const renderedImage = (
                            <Image
                                src={image.base64}
                                width={0}
                                height={0}
                                alt={image.alt}
                                className="w-full border-2 border-stress-secondary"
                            />
                        )

                        return (
                            <div 
                                key={image.id} 
                                className="mb-4"
                                onClick={onImageClick && (() => onImageClick(image))}
                            >
                                {
                                    linkRoot ? (
                                        <Link 
                                            href={`${linkRoot}/${image.id}`}
                                        >
                                            {renderedImage}
                                        </Link>
                                    ) : (
                                        renderedImage
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}