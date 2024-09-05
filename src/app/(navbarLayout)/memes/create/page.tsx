import { auth } from "@/app/api/auth/[...nextauth]/auth"
import CreateMemeForm from "@/components/jsx/form/CreateMemeForm"
import { DeepImageGridFetchAction } from "@/components/jsx/grid/DeepImageGrid"
import { getTemplates } from "@/data/api/controllers/template"

export default async function CreateMemePage() {
  const session = await auth()
  const sessionUser = session?.user

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
    <main className="flex flex-col gap-8 items-center">
      <h1>Create Meme</h1>
      <CreateMemeForm
        sessionUserId={sessionUser?.id ?? null}
        templateGridFetchAction={templateGridFetchAction}
      />
    </main>
  )
}