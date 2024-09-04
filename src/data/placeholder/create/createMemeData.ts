import { v4 as uuidv4 } from 'uuid'
import { MemeImage } from '../../api/types/model/types'
import { Meme, User } from '@prisma/client'

/*
    Users are given ${memesPerUser} memes until a user gets leftovers. 
    Leftovers can be more ore less than the value of memesPerUser.
    If memesPerUser is null, memes are split evenly.
*/
export default function createMemeData(
    memeImages: MemeImage[], 
    users: User[], 
    memesPerUser: number | null = null, 
    memelessUser=true,  
    privateCount=5
): Meme[] {
    if (users.length === 0 || memeImages.length === 0) {
        throw new Error('Num of users/meme-images must be greater than zero.')
    }

    if (memesPerUser !== null && memesPerUser < 1) {
        throw new Error('Memes per user must be null or at least 1.')
    }

    if (memelessUser) {
        // Let first user have no memes
        users = users.slice(1)

        if (users.length === 0) {
            throw new Error('Not enough users for meme distribution.')
        }
    }

    const memes: Meme[] = []

    // Create private memes
    if (privateCount > 0) {
        if (memeImages.length < privateCount) {
            throw new Error('Private count impossible for given meme image count.')
        }

        const user = users[0]
        // Give all private memes to first user
        for (let i=0; i < privateCount; i++) {
            const image = memeImages[i]
            const { id, template_id, text } = image
            memes.push({
                id: uuidv4(),
                template_id,
                text,
                user_id: user.id,
                private: true,
                product_image_id: id,
                create_date: new Date()
            })
        }

        memeImages = memeImages.slice(privateCount)
    }

    if (memesPerUser === null) {
        // Impossible for users.length === 0
        // At least 1 meme per user
        memesPerUser = Math.max(1, Math.floor(memeImages.length / users.length))
    }

    let userIndex = 0

    // Create public memes
    for(let i=0; i < memeImages.length; i++) {
        // Remaining memes after distribution go to last user
        if (
            i !== 0 
            && i % memesPerUser === 0 
            && userIndex < users.length-1
        ) {
            userIndex += 1
        }

        const image = memeImages[i]
        const user = users[userIndex]
        const { id, template_id, text } = image

        memes.push({
            id: uuidv4(),
            template_id,
            text,
            user_id: user.id,
            private: false,
            product_image_id: id,
            create_date: new Date()
        })
    }
    
    return memes
}