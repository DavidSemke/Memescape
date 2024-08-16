import nlp from 'compromise'

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

export function miscMemePredicates(
    userId: string | undefined = undefined,
    excludeIds: string[] | undefined = undefined,
    includePrivate: boolean = false,
    alias: string = 'm'
) {
    const predicates = []

    if (userId !== undefined) {
        predicates.push(`${alias}.user_id = '${userId}'`)
    }

    if (excludeIds !== undefined) {
        predicates.push(
            `${alias}.id NOT IN (${excludeIds.map(id => `'${id}'`).join(', ')})`
        )
    }
    
    if (!includePrivate) {
        predicates.push(`${alias}.private = FALSE`)
    }

    return predicates
}