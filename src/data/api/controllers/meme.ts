'use server'

import prisma from '../../prisma/client';
import { templateSearchPredicates, wordRegexes } from '../utils';
import { JoinedMeme, NestedJoinedMeme } from '../definitions';

export async function getMemeById(id: string) {
    try {
        return await prisma.meme.findUnique({
            include: {
                product_image: true
            },
            where: { id }
        })
    }
    catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}

export async function getMemesBySearchInput(
    searchInput: string, 
    userId: string | undefined = undefined,
    limit: number | undefined = undefined
): Promise<NestedJoinedMeme[]> {
    const regexes = wordRegexes(searchInput)
    const predicates = templateSearchPredicates(regexes.length)
        .map((p, i) => {
            p = p.slice(0, -1) // Remove closing bracket to add more
            // Check if word in meme text, a list of multi-word strings
            return p + ' OR EXISTS'
                + ` (SELECT 1 FROM unnest(m.text) AS line WHERE line ILIKE $${i+1}))`
        })
    
    let query = 'SELECT m.*, t.name, t.keywords, i.data, i.mime_type FROM "Meme" as m'
        + ' JOIN "Template" as t ON m.template_id = t.id'
        + ' JOIN "Image" as i ON m.product_image_id = i.id WHERE '
        + predicates.join(' AND ')
    
    if (userId !== undefined) {
        query += ` AND m.user_id = '${userId}'`
    }
        
    if (limit !== undefined) {
        query += ` LIMIT ${limit}`
    }

    try {
        // All user input is safely injected via query parameters (e.g. $1)
        // So not unsafe in this case
        const memes = await prisma.$queryRawUnsafe<JoinedMeme[]>(
            query, ...regexes
        )

        return memes.map(meme => {
            const image = {
                id: meme.product_image_id,
                data: meme.data,
                mime_type: meme.mime_type
            }
            const template = {
                id: meme.template_id,
                name: meme.name,
                keywords: meme.keywords
            }
            const nestedMeme: (
                NestedJoinedMeme 
                & Partial<{ 
                    data: Buffer, 
                    mime_type: string, 
                    name: string,
                    keywords: string[]
                }>
            ) = {
                ...meme,
                product_image: image,
                template
            }
            delete nestedMeme.data
            delete nestedMeme.mime_type
            delete nestedMeme.name
            delete nestedMeme.keywords

            return nestedMeme
        })
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}

export async function getMemes(
    userId: string | undefined, 
    limit: number | undefined
) {
    try {
        return await prisma.meme.findMany({
            include: {
                product_image: true,
                template: true
            },
            where: {
                user_id: userId
            },
            take: limit
        })
    }
    catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}