export function searchQueryWordRegexes(searchQuery: string) {
    const wordRegexes = searchQuery
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => word !== '')
        .map(word => `%${word}%`)
    
    if (!wordRegexes.length) {
        throw new Error("Param 'searchQuery' cannot be an empty string.")
    }

    return wordRegexes
}