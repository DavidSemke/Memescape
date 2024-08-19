import Image from "next/image"
import Link from "next/link"
import { NestedMeme } from "@/data/api/types/model/types"

type MemeGridProps = {
    memeGroups: NestedMeme[][]
}


export default function MemeGrid({ memeGroups }: MemeGridProps) {
    memeGroups = memeGroups.filter(group => group.length !== 0)

    return (
        <div>
            {memeGroups.map((group: NestedMeme[], index) => {
                return (
                    <div 
                        key={group[index].id}
                        className='columns-2 gap-4 w-full pb-4 mt-4 first:mt-0 border-b-2 border-stress-secondary sm:columns-4 md:columns-5 lg:columns-6'
                    >
                        {group.map((meme) => {
                            if (!meme.product_image || !meme.template) {
                                throw new Error('Nested meme lacks data.');
                            }

                            const imageSrc = meme.product_image.base64;
                            const alt = `${meme.template.name}. ${meme.text.join('. ')}`;

                            return (
                                <div 
                                    key={meme.id} 
                                    className="mb-4"
                                >
                                    <Link 
                                        href={`/memes/${meme.id}`}
                                    >
                                        <Image
                                            src={imageSrc}
                                            width={0}
                                            height={0}
                                            alt={alt}
                                            className="w-full border-2 border-stress-secondary"
                                        />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}