export function pageClause(page: number, pageSize: number) {
    if (page < 1) {
        throw new Error('Page number cannot be less than 1.')
    }

    const offset = (page - 1) * pageSize;
    
    return `LIMIT ${pageSize} OFFSET ${offset}`
}