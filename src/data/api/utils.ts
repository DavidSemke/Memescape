export function base64String(data: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${data.toString('base64')}`
}