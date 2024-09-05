import { Template } from "@prisma/client"

export default async function createTemplateData(): Promise<Template[]> {
  const url = "https://api.memegen.link/templates/"
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  const jsonTemplates: Template[] = await response.json()
  const idSet = new Set()
  const templates = []

  for (const jsonTemplate of jsonTemplates) {
    let { id, name, keywords, lines } = jsonTemplate

    if (idSet.has(id)) {
      continue
    }

    idSet.add(id)
    name = name.toLowerCase()
    keywords = keywords.map((word) => word.toLowerCase())
    templates.push({ id, name, keywords, lines })
  }

  return templates
}
