'use server'

import prisma from '../../prisma/client';
import { Template } from '@prisma/client';
import { templateSearchPredicates, wordRegexes } from '../query/where';
import { pageClause } from '../query/postWhere';

export async function getTemplates(
    searchInput: string,
    page: number = 1,
    pageSize: number = 20,
): Promise<Template[]> {
    const regexes = wordRegexes(searchInput)
    const predicates = templateSearchPredicates(regexes.length)
    const querySegments = [
        'SELECT * FROM "Template" as t',
        `WHERE ${predicates.join(' AND ')}`,
        'ORDER BY t.name',
        pageClause(page, pageSize)
    ]

    try {
        return await prisma.$queryRawUnsafe<Template[]>(
            querySegments.join(' '), ...regexes
        )
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}