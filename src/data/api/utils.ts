export function base64String(data: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${data.toString('base64')}`
}

export function isPlainObject(value: any) {
    return (
        value !== null 
        && typeof value === 'object'
        && value.constructor === Object
    )
}