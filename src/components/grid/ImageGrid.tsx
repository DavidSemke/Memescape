import Image from "next/image"

type ImageGridProps = {
    images: Array<{
        src: string,
        alt: string
    }>
}

export default function ImageGrid({ images }: ImageGridProps) {
    return (
        <div className='grid gap-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12'>
            {
                images.map((img) => {
                    return (
                        <Image
                            key={img.src}
                            src={img.src}
                            width={64}
                            height={64}
                            alt={img.alt}
                        />
                    )
                })
            }
        </div>
    )
}