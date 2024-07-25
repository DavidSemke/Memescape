'use server'

import prisma from '../../prisma/client';
import { Meme } from '@prisma/client';
import { searchQueryWordRegexes } from '../utils';

export async function getMemes(
    searchQuery: string | null = null, 
    userId: string | null = null,
) {
    if (searchQuery === null) {
        try {
            if (userId === null) {
                return await prisma.meme.findMany()
            }
    
            return await prisma.meme.findMany({
                where: {
                    user_id: userId
                }
            })
        }
        catch(error) {
            console.error('Database Error:', error);
            throw new Error('Failed to fetch memes.');
        }
    }

    const wordRegexes = searchQueryWordRegexes(searchQuery)
    
    // Check if word in template name
    // Check if word in template keywords, a list of multi-word strings
    // Check if word in meme text, a list of multi-word strings

    let query = 'SELECT m.* FROM "Meme" as m'
        + ' JOIN "Template" as t ON m.template_id = t.id'
        + ' WHERE'
    
    if (userId !== null) {
        query += ` m.user_id = '${userId}' AND`
    }
        
    for (let i=1; i<wordRegexes.length+1; i++) {
        query += ` (t.name ILIKE $${i}`
            + ' OR EXISTS'
            + ` (SELECT 1 FROM unnest(t.keywords) AS keyword WHERE keyword ILIKE $${i})`
            + ' OR EXISTS'
            + ` (SELECT 1 FROM unnest(m.text) AS line WHERE line ILIKE $${i}))`
            + ' AND'
    }

    // Remove trailing ' AND'
    query = query.slice(0, -4)

    try {
        // All user input is safely injected via query parameters (e.g. $1)
        // So not unsafe in this case
        return await prisma.$queryRawUnsafe<Meme[]>(
            query, ...wordRegexes
        )
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}