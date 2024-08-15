'use server'

import prisma from '../../prisma/client';
import { Template } from '@prisma/client';
import { templateSearchPredicates, wordRegexes } from '../query/where';

export async function getTemplatesBySearchInput(
    searchInput: string,
    limit: number | undefined
): Promise<Template[]> {
    const regexes = wordRegexes(searchInput)
    const predicates = templateSearchPredicates(regexes.length)
    let query = 'SELECT * FROM "Template" as t WHERE ' + predicates.join(' AND ')
    
    if (limit !== undefined) {
        query += ` LIMIT ${limit}`
    }

    try {
        // All user input is safely injected via query parameters (e.g. $1)
        // So not unsafe in this case
        return await prisma.$queryRawUnsafe<Template[]>(
            query, ...regexes
        )
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}