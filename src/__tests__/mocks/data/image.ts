import { ProcessedImage } from "@/data/api/types/model/types"
import { base64String } from "@/data/api/utils"
import { v4 as uuidv4 } from "uuid"

// export function mockImage(): Image {
//     return {
//         id: uuidv4(),
//         mime_type: 'image/jpeg',
//         data: Buffer.from('')
//     }
// }

export function mockProcessedImage(
    alt: string = '',
    id: string = uuidv4()
): ProcessedImage {
    return {
        id,
        mime_type: 'image/jpeg',
        alt,
        base64: base64String(Buffer.from(''), 'image/jpeg'),
        linkId: id
    }
}