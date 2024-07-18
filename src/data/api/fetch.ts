import prisma from '../prisma/client';
import { Meme, Template } from '@prisma/client';
import { searchQueryWordRegexes } from './utils';

export async function fetchUserByName(name: string, profile_image=false) {
  try {
    return await prisma.user.findUnique({
        include: { profile_image },
        where: { name },
    })
  } 
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchMemes(
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

export async function fetchBookmarks(userId: string) {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            include: { 
                user: true,
                meme: true
            },
            where: { 
                user_id: userId 
            },
        })
    
        return bookmarks
    } 
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch bookmarks.');
    }
}

export async function fetchTemplates(searchQuery: string | null) {
    if (searchQuery === null) {
        try {
            return await prisma.template.findMany()
        } catch (error) {
            console.error('Database Error:', error);
            throw new Error('Failed to fetch templates.');
        }
    }

    const wordRegexes = searchQueryWordRegexes(searchQuery)
    
    // Check if word in template name
    // Check if word in template keywords, a list of multi-word strings

    let query = 'SELECT * FROM "Template" WHERE'
        
    for (let i=1; i<wordRegexes.length+1; i++) {
        query += ` (name ILIKE $${i}`
            + ' OR EXISTS' 
            + ` (SELECT 1 FROM unnest(keywords) AS keyword WHERE keyword ILIKE $${i}))`
            + ' AND'
    }

    // Remove trailing ' AND'
    query = query.slice(0, -4)

    try {
        // All user input is safely injected via query parameters (e.g. $1)
        // So not unsafe in this case
        return await prisma.$queryRawUnsafe<Template[]>(
            query, ...wordRegexes
        )
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch memes.');
    }
}