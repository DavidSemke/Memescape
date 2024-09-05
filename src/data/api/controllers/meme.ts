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
import { JoinedMeme, NestedMeme, ProcessedImage } from '../types/model/types';
import { nestMeme, processImageNoAlt, unprocessImage } from '../types/model/transforms';
import { FormState } from '../types/action/types';
import { createMemeSchema } from '../validation/meme';
import { error500Msg } from '../validation/errorMsg';
import { getOneTemplate } from './template';
import { redirect } from 'next/navigation';
import { memeDownloadName, memeAlt } from '../types/model/transforms';
import { string } from 'zod';

export async function getOneMeme(id: string): Promise<NestedMeme | null> {
    const parse = await string().uuid().safeParseAsync(id)

    if (!parse.success) {
        return null
    }

    const query = preWhereMemeQuery() + ' WHERE m.id = $1::uuid'

    try {
        const [meme=null] = await prisma.$queryRawUnsafe<JoinedMeme[]>(
            query, id
        )

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

    querySegments.push(
        'ORDER BY m.create_date DESC',
        pageClause(page, pageSize)
    )

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

    querySegments.push(
        'ORDER BY m.create_date DESC',
        pageClause(page, pageSize)
    )

    try {
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
    lineCount: number | null, prevState: FormState, formData: FormData
  ): Promise<FormState> {
    if (!lineCount || lineCount < 1) {
        throw new Error('Line count must be non-null and greater than 0.')
    }
    
    const parseObject: Record<
        string, 
        FormDataEntryValue | null
    > = {
        template_id: formData.get('template-id'),
        user_id: formData.get('user-id'),
        private: formData.get('private'),
    }

    for (let i=1; i<lineCount+1; i++) {
        const name = `line${i}`
        parseObject[name] = formData.get(name)
    }

    const parse = await createMemeSchema(
        lineCount, true
    ).safeParseAsync(parseObject)

    if (!parse.success) {
        return {
            errors: parse.error.flatten().fieldErrors
        }
    }

    let meme = null
    const text: string[] = []

    for (let i=1; i<lineCount+1; i++) {
        const name = `line${i}`
        text.push(parse.data[name])
    }

    try {
        const processedImage = await generateMemeImage(
            formData.get('template-id') as string,
            text
        )

        const unprocessedImage = unprocessImage(processedImage)
        const createdImage = await prisma.image.create({
            data: {
                mime_type: unprocessedImage.mime_type,
                data: unprocessedImage.data
            }
        })

        const data = {
            product_image_id: createdImage.id,
            template_id: parse.data.template_id,
            user_id: parse.data.user_id,
            private: parse.data.private,
            text
        }

        meme = await prisma.meme.create({ data })
    }
    catch (error) {
        return error500Msg
    }

    redirect(`/memes/${meme.id}`)
}

export async function generateMemeImage(
    templateId: string,
    text: string[]
): Promise<ProcessedImage> {
    const processedText = text.map(text => {
        if (text === '') {
            return '_'
        }

        return text
            .replaceAll('-', '--')
            .replaceAll('_', '__')
            .replaceAll(' ', '-')
            .replaceAll('?', '~q')
            .replaceAll('&', '~a')
            .replaceAll('%', '~p')
            .replaceAll('#', '~h')
            .replaceAll('/', '~s')
            .replaceAll('\\', '~b')
            .replaceAll('<', '~l')
            .replaceAll('>', '~g')
            .replaceAll('"', '\'\'')
    }
    )
    const ext = 'jpeg'
    const [factoryRes, template] = await Promise.all([
        fetch(
            `https://api.memegen.link/images/${templateId}/`
            + processedText.join('/')
            + `.${ext}`
        ),
        getOneTemplate(templateId)
    ])
    
    if (!factoryRes.ok) {
        throw new Error(`Response status: ${factoryRes.status}`);
    }

    if (!template) {
        throw new Error(`Template with given id does not exist.`);
    }

    const buffer = Buffer.from(await factoryRes.arrayBuffer())
    const mime_type = `image/${ext}`

    return {
        ...processImageNoAlt({ 
            id: templateId,
            data: buffer,
            mime_type 
        }),
        alt: memeAlt(
            template.name, text
        ),
        downloadName: memeDownloadName(
            template.name, mime_type
        )
    }
}