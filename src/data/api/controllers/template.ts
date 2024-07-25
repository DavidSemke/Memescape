'use server'

import prisma from '../../prisma/client';
import { Template } from '@prisma/client';
import { searchQueryWordRegexes } from '../utils';

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