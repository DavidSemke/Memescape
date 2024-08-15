import { MemeImage } from '@/data/api/types/model/types';
import { v4 as uuidv4 } from 'uuid'

export default async function createMemeImageData(count=100): Promise<MemeImage[]> {
    const url = "https://api.memegen.link/templates/";
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const memeImages: MemeImage[] = []
    const templates = await response.json();
    const idSet = new Set()
    const reqContext = []
    const requests = []

    for (let i=0; i<templates.length && i<count; i++) {
        const { id: template_id, example } = templates[i]
        const { url, text } = example

        if (idSet.has(template_id)) {
            continue
        }

        idSet.add(template_id)
        reqContext.push({ url, template_id, text })
        // Push promise to download example meme and convert to Buffer type
        requests.push(new Promise<Buffer>(async (resolve, reject) => {
            try {
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                }

                const buffer = Buffer.from(await res.arrayBuffer());
                resolve(buffer);
            } 
            catch (error) {
                reject(error);
            }
        }))
    }

    const buffers = await Promise.all(requests)

    for (let i=0; i<buffers.length; i++) {
        const buffer = buffers[i]
        const { url, template_id, text } = reqContext[i]
        const split = url.split('.')
        let ext = split[split.length-1]

        if (ext === 'jpg') {
            ext = 'jpeg'
        }
        else if (!['png', 'webp', 'gif'].includes(ext)) {
            throw new Error(`Image extension "${ext}" is not jpg/jpeg/png/webp/gif.`)
        }

        memeImages.push({
            id: uuidv4(),
            data: buffer,
            mime_type: 'image/png',
            template_id,
            text
        })
    }

    return memeImages
}