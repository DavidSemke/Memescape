'use server'

import prisma from '../../prisma/client';
import { Template } from '@prisma/client';
import { NestedTemplate } from '../types/model/types';
import { templateSearchPredicates, wordRegexes } from '../query/where';
import { pageClause } from '../query/postWhere';
import { nestTemplate } from '../types/model/transforms';

export async function getOneTemplate(
    id: string, includeImage = false
): Promise<NestedTemplate | null> {
    const query = 'SELECT * FROM "Template" as t WHERE t.id = $1'

    try {
        const [template=null] = await prisma.$queryRawUnsafe<Template[]>(
            query, id
        )

        if (!template || !includeImage) {
            return template
        }

        return await nestTemplate(template)
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}

export async function getTemplates(
    searchInput: string,
    page: number = 1,
    pageSize: number = 20,
    includeImage = false
): Promise<NestedTemplate[]> {
    if (searchInput === '') {
        return []
    }
    
    const regexes = wordRegexes(searchInput)
    const predicates = templateSearchPredicates(regexes.length)
    const querySegments = [
        'SELECT * FROM "Template" as t',
        `WHERE ${predicates.join(' AND ')}`,
        'ORDER BY t.name',
        pageClause(page, pageSize)
    ]

    try {
        const templates = await prisma.$queryRawUnsafe<Template[]>(
            querySegments.join(' '), ...regexes
        )

        if (!includeImage) {
            return templates
        }

        return await Promise.all(templates.map(nestTemplate))
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch templates.');
    }
}