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
    const regexes = searchInput
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => word !== '')
        .map(word => `%${word}%`)
    
    if (!regexes.length) {
        throw new Error("Param 'searchInput' cannot be an empty string.")
    }

    return regexes
}