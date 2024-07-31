'use server'

import prisma from '../../prisma/client';
import { 
    templateSearchPredicates, 
    wordRegexes, 
    normalizedNouns,
    preWhereMemeQuery,
    base64String
} from '../utils';
import { 
    JoinedMeme, 
    NestedMeme, 
    NestedUser,
    isNestedMeme 
} from '../types/model';

export async function getMemeById(id: string): Promise<NestedMeme | null> {
    let meme = null

    try {
        meme = await prisma.meme.findUnique({
            include: {
                product_image: true,
                template: true,
                user: {
                    include: {
                        profile_image: true
                    }
                }
            },
            where: { id }
        })
    }
    catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }

    if (!meme) {
        return meme
    }

    // Process nested meme images
    // Images include:
    // 1 - meme product image
    // 2 - user profile image
    const { 
        data: productData, 
        mime_type: productMimeType 
    } = meme.product_image
    const productBase64 = base64String(productData, productMimeType)
    
    const nestedMeme: Record<string, any> = {
        ...meme,
        product_image: {
            id: meme.product_image_id,
            base64: productBase64
        }
    }

    if (!meme.user.profile_image) {
        if (isNestedMeme(nestedMeme)) {
            return nestedMeme
        }

        throw new TypeError('Value is not of type NestedMeme')
    }

    const { 
        data: profileData, 
        mime_type: profileMimeType 
    } = meme.user.profile_image
    const profileBase64 = base64String(profileData, profileMimeType)

    nestedMeme.user.profile_image = {
        id: nestedMeme.user.profile_image_id,
        base64: profileBase64
    }

    if (isNestedMeme(nestedMeme)) {
        return nestedMeme
    }

    throw new TypeError('Value is not of type NestedMeme')
}

export async function getMemes(
    searchInput: string | null = null,
    userId: string | undefined = undefined, 
    limit: number | undefined = undefined,
    excludeIds: string[] | undefined = undefined,
    includePrivate: boolean = false,
    random: boolean = true,
): Promise<NestedMeme[]> {
    let query = preWhereMemeQuery()

    // Predicates of where clause are joined by AND
    const wherePredicates = []
    let regexes: string[] = []
    
    if (searchInput !== null) {
        regexes = wordRegexes(searchInput)

        if (regexes.length) {
            const searchPredicates = templateSearchPredicates(regexes.length)
            .map((p, i) => {
                p = p.slice(0, -1) // Remove closing bracket to add more
                // Check if word in meme text, a list of multi-word strings
                return p + ' OR EXISTS'
                    + ` (SELECT 1 FROM unnest(m.text) AS line WHERE line ILIKE $${i+1}))`
            })
        
            wherePredicates.push(`(${searchPredicates.join(' AND ')})`)
        }
    }

    if (userId !== undefined) {
        wherePredicates.push(`m.user_id = '${userId}'`)
    }

    if (excludeIds !== undefined) {
        wherePredicates.push(
            `m.id NOT IN (${excludeIds.map(id => `'${id}'`).join(', ')})`
        )
    }
    
    if (!includePrivate) {
        wherePredicates.push('m.private = FALSE')
    }

    // Append where clause if exists
    if (wherePredicates.length) {
        query += ` WHERE ${wherePredicates.join(' AND ')}`
    }

    if (random) {
        query += ' ORDER BY RANDOM()'
    }

    if (limit !== undefined) {
        query += ` LIMIT ${limit}`
    }

    try {
        const memes = await prisma.$queryRawUnsafe<JoinedMeme[]>(
            query, ...regexes
        )
        return memes.map(nestedMeme)
    }
    catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }   
}

/*
    Memes are related to a meme M if they
    1 - Use a subset of the nouns used by M
    2 - Share the template used by M
*/
export async function getRelatedMemes(
    meme: NestedMeme,
    limit: number | undefined = undefined,
    includePrivate: boolean = false,
): Promise<NestedMeme[]> {
    let query = preWhereMemeQuery()
    
    // Predicates of where clause are joined by AND
    // First predicate ensures meme being related to is excluded
    const wherePredicates = [
        `m.id <> '${meme.id}'`
    ]

    const nouns = normalizedNouns(meme.text.join(' '))
    let regexes: string[] = []
    
    // If no nouns found, return only template-related memes
    if (nouns.length) {
        regexes = wordRegexes(nouns.join(' '))
        const predicates = []

        for (let i=1; i<regexes.length+1; i++) {
            predicates.push(
                `(EXISTS (SELECT 1 FROM unnest(m.text) AS line`
                + ` WHERE line ILIKE $${i}))`
            )
        }

        wherePredicates.push(
            `(${predicates.join(' OR ')}`
            + ` OR t.id = \'${meme.template_id}\')`
        )
    }

    if (!includePrivate) {
        wherePredicates.push('m.private = FALSE')
    }

    // Append where clause if exists
    if (wherePredicates.length) {
        query += ` WHERE ${wherePredicates.join(' AND ')}`
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

        return memes.map(nestedMeme)
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}

// Assumes that all foreign key relations are joined
function nestedMeme(meme: JoinedMeme): NestedMeme {
    const product_image = {
        id: meme.mi_id,
        base64: base64String(meme.mi_data, meme.mi_mime_type)
    }
    const template = {
        id: meme.t_id,
        name: meme.t_name,
        keywords: meme.t_keywords
    }
    // Password is hashed, so including it is safe
    const user: NestedUser = {
        id: meme.u_id,
        name: meme.u_name,
        password: meme.u_password,
        profile_image_id: meme.ui_id ?? null,
        profile_image: meme.ui_id ? {
            id: meme.ui_id,
            base64: base64String(meme.ui_data, meme.ui_mime_type)
        } : null
    }

    const nestedMeme: Record<string, any> = {
        product_image,
        template,
        user
    }

    let key: keyof JoinedMeme

    for (key in meme) {
        if (key.startsWith('m_')) {
            const nestedKey = key.slice(2)
            nestedMeme[nestedKey] = meme[key]
        }
    }

    if (isNestedMeme(nestedMeme)) {
        return nestedMeme
    }

    throw new TypeError('Value is not of type NestedMeme')
}