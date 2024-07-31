import nlp from 'compromise'
import { Prisma } from '@prisma/client'

export function base64String(data: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${data.toString('base64')}`
}

// Param alias is the SQL alias for the template table
// Need alias for larger queries
export function templateSearchPredicates(
    searchWordCount: number,
    alias: string = 't'
) {
    let predicates = []

    // Check if word in template name
    // Check if word in template keywords, a list of multi-word strings
    for (let i=1; i<searchWordCount+1; i++) {
        predicates.push(`(${alias}.name ILIKE $${i}`
            + ` OR EXISTS (SELECT 1 FROM unnest(${alias}.keywords) AS keyword`
            + ` WHERE keyword ILIKE $${i}))`
        )
    }

    return predicates
}

// Return a list of regexes that match given a specific word
// Words are extracted from searchInput by splitting on space char
export function wordRegexes(searchInput: string) {
    return searchInput
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => word !== '')
        .map(word => `%${word}%`)
}

export function normalizedNouns(text: string): string[] {
    // Must have two separate nlp chains to erase context
    // Otherwise, 'singer's' normalized to 'singer' remains possessive
    // (which causes 'singer' to be filtered out)  
    const contextNounString = nlp(text)
        .nouns()
        .toSingular()
        .normalize({
            unicode: true,
            possessives: true,
        })
        .match('#Noun')
        .out('array')
        .join(' ')
    
    return nlp(contextNounString)
        .match('#Noun')
        .toLowerCase()
        .unique()
        .not('#Pronoun')
        .not('#Possessive')
        .out('array')
        .map((noun: string) => noun.replace(/[^0-9a-z]/gi, ''))
}

function aliasCols(cols: string[], prefix: string) {
    return cols.map(col => `${prefix}.${col} as ${prefix}_${col}`)
}

function memeAliasCols() {
    return aliasCols(
        Object.values(Prisma.MemeScalarFieldEnum), 
        'm'
    )
}

function templateAliasCols() {
    return aliasCols(
        Object.values(Prisma.TemplateScalarFieldEnum), 
        't'
    )
}

function userAliasCols() {
    return aliasCols(
        Object.values(Prisma.UserScalarFieldEnum), 
        'u'
    )
}

function imageAliasCols(prefix:'ui'|'mi') {
    return aliasCols(
        Object.values(Prisma.ImageScalarFieldEnum), 
        prefix
    )
}

export function preWhereMemeQuery() {
    const colGroups = [
        memeAliasCols(),
        templateAliasCols(),
        userAliasCols(),
        imageAliasCols('ui'),
        imageAliasCols('mi')
    ]
    const select = colGroups.map(
        colGroup => colGroup.join(', ')
    ).join(', ')

    return (
        `SELECT ${select} FROM "Meme" as m 
        JOIN "Template" as t ON m.template_id = t.id 
        JOIN "User" as u ON m.user_id = u.id 
        JOIN "Image" as mi ON m.product_image_id = mi.id 
        LEFT JOIN "Image" as ui ON u.profile_image_id = ui.id
        `
    )
}

export function preWhereUserQuery(profile_image=false) {
    const colGroups = [
        userAliasCols(),
    ]
    let profileImageJoin = ''

    if (profile_image) {
        colGroups.push(imageAliasCols('ui'))
        profileImageJoin = 'LEFT JOIN "Image" as ui ON u.profile_image_id = ui.id'
    }

    const select = colGroups.map(
        colGroup => colGroup.join(', ')
    ).join(', ')

    return (
        `SELECT ${select} FROM "User" as u 
        ${profileImageJoin}
        `
    )
}