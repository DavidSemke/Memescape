import { MemeImage } from "@/data/api/types/model/types"
import { v4 as uuidv4 } from "uuid"

// The memgen api provides some inappropriate example memes.
// These memes are blacklisted here using their template ids 
// for skipping.
const blacklistedExampleTemplateIds = [
  'apcr',
  'blb',
  'fmr',
  'wkh'
]

export default async function createMemeImageData(
  count = 100
): Promise<MemeImage[]> {
  const factoryUrl = "https://api.memegen.link/templates/"
  const response = await fetch(factoryUrl)

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  const memeImages: MemeImage[] = []
  const templates = await response.json()
  // Add blacklisted examples to set to skip them
  const idSet = new Set(blacklistedExampleTemplateIds)
  const reqContext = []
  const requests = []

  for (let i = 0, j = 0; i < templates.length && j < count; i++) {
    const { id: template_id, example } = templates[i]

    if (idSet.has(template_id)) {
      continue
    }

    idSet.add(template_id)

    const url = example.url.split(".").slice(0, -1).join(".") + ".jpeg"
    reqContext.push({ url, template_id, text: example.text })

    // Push promise to download example meme and convert to Buffer type
    requests.push(
      new Promise<Buffer>(async (resolve, reject) => {
        try {
          const res = await fetch(url)

          if (!res.ok) {
            throw new Error(`Response status: ${res.status}`)
          }

          const buffer = Buffer.from(await res.arrayBuffer())
          resolve(buffer)
        } catch (error) {
          reject(error)
        }
      }),
    )

    // Adjust ms to avoid overwhelming server.
    // Might get 503 response if not used.
    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })

    j++
  }

  const buffers = await Promise.all(requests)

  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i]
    const { url, template_id, text } = reqContext[i]
    const split = url.split(".")
    let ext = split[split.length - 1]

    if (ext === "jpg") {
      ext = "jpeg"
    } else if (!["jpeg", "png", "webp", "gif"].includes(ext)) {
      throw new Error(`Image extension "${ext}" is not jpg/jpeg/png/webp/gif.`)
    }

    memeImages.push({
      id: uuidv4(),
      data: buffer,
      mime_type: `image/${ext}`,
      template_id,
      text,
    })
  }

  return memeImages
}
