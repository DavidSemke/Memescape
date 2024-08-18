'use server'

import prisma from '../../prisma/client';
import { preWhereMemeQuery } from '../query/preWhere';
import { 
    templateSearchPredicates,
    wordRegexes,
    normalizedNouns,
    miscMemePredicates
} from '../query/where';
import { pageClause } from '../query/postWhere';
import { JoinedMeme, NestedMeme } from '../types/model/types';
import { nestMeme } from '../types/model/transforms';
import { FormState } from '../types/action/types';
import { postMemeSchema } from '../validation/meme';
import { error500Msg } from '../validation/errorMsg';

export async function getOneMeme(id: string): Promise<NestedMeme | null> {
    const query = preWhereMemeQuery() + ` WHERE m.id = '${id}'`

    try {
        const [meme=null] = await prisma.$queryRawUnsafe<JoinedMeme[]>(query)

        if (!meme) {
            return meme
        }

        return nestMeme(meme)
    }
    catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}

export async function getMemes(
    searchInput: string | null = null,
    page: number = 1,
    pageSize: number = 20,
    userId: string | undefined = undefined, 
    excludeIds: string[] | undefined = undefined,
    includePrivate: boolean = false,
): Promise<NestedMeme[]> {
    const querySegments = [preWhereMemeQuery()]
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
        // If a user's search input is an empty string, no memes should be fetched
        else {
            return []
        }
    }

    wherePredicates.push(
        ...miscMemePredicates(userId, excludeIds, includePrivate)
    )

    // Append where clause if exists
    if (wherePredicates.length) {
        querySegments.push(`WHERE ${wherePredicates.join(' AND ')}`)
    }

    querySegments.push(pageClause(page, pageSize))

    try {
        const memes = await prisma.$queryRawUnsafe<JoinedMeme[]>(
            querySegments.join(' '), ...regexes
        )
        return memes.map(nestMeme)
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
    page: number = 1,
    pageSize: number = 20,
    userId: string | undefined = undefined, 
    excludeIds: string[] | undefined = undefined,
    includePrivate: boolean = false,
): Promise<NestedMeme[]> {
    const querySegments = [preWhereMemeQuery()]
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

    wherePredicates.push(
        ...miscMemePredicates(userId, excludeIds, includePrivate)
    )

    // Append where clause if exists
    if (wherePredicates.length) {
        querySegments.push(`WHERE ${wherePredicates.join(' AND ')}`)
    }

    querySegments.push(pageClause(page, pageSize))

    try {
        // All user input is safely injected via query parameters (e.g. $1)
        // So not unsafe in this case
        const memes = await prisma.$queryRawUnsafe<JoinedMeme[]>(
            querySegments.join(' '), ...regexes
        )

        return memes.map(nestMeme)
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}

export async function postMeme(
    prevState: FormState, formData: FormData
  ): Promise<FormState> {
      const parse = await postMemeSchema.safeParseAsync({
        template_id: formData.get('template-id'),
        user_id: formData.get('user-id'),
        product_image_id: formData.get('product-image-id'),
        text: formData.get('text'),
        private: formData.get('private'),
        create_date: formData.get('create-date'),
    })

    if (!parse.success) {
        return {
            errors: parse.error.flatten().fieldErrors
        }
    }

    try {
        await prisma.meme.create({
            data: parse.data
        })
    }
    catch (error) {
        return error500Msg
    }

    return true
}