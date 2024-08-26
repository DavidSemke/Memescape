import CreateMemeForm from "@/components/form/CreateMemeForm"
import { DeepImageGridFetchAction } from "@/components/grid/DeepImageGrid"
import { getTemplates } from "@/data/api/controllers/template"

export default function CreateMemePage() {
  const templateGridFetchAction: DeepImageGridFetchAction = async (
    query, page, pageSize
  ) => {
    'use server'
    
    const templates = await getTemplates(
        query ?? '', page, pageSize, true
    )

    return templates.map(template => template.image!)
  }

  return (
    <main className="flex flex-col gap-4 items-center">
      <h1>Create Meme</h1>
      <CreateMemeForm 
        templateGridFetchAction={templateGridFetchAction}
      />
    </main>
  )
}