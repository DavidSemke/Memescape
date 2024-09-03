export function base64String(data: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${data.toString('base64')}`
}

export function bufferFromBase64(base64: string) {
    return Buffer.from(
        base64.slice(base64.indexOf(',')+1),
        'base64'
    )
}

export function isPlainObject(value: any) {
    return (
        value !== null 
        && typeof value === 'object'
        && value.constructor === Object
    )
}