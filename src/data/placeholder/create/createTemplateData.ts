import { Template } from "@prisma/client";

export default async function createTemplateData(): Promise<Template[]> {
    const url = "https://api.memegen.link/templates/";
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const JsonTemplates: Template[] = await response.json();
    const idSet = new Set()
    const templates = []

    for (const JsonTemplate of JsonTemplates) {
        let { id, name, keywords } = JsonTemplate
        
        if (idSet.has(id)) {
            continue
        }
        
        idSet.add(id)
        name = name.toLowerCase()
        keywords = keywords.map(word => word.toLowerCase())
        templates.push({ id, name, keywords })
    }

    return templates
}