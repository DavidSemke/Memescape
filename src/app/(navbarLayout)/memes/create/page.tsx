import { auth } from "@/app/api/auth/[...nextauth]/auth"
import CreateMemeForm from "@/components/jsx/form/createMemeForm/CreateMemeForm"
import { DeepImageGridFetchAction } from "@/components/jsx/grid/deepImageGrid/DeepImageGrid"
import { getTemplates } from "@/data/api/controllers/template"

export default async function CreateMemePage() {
  const session = await auth()
  const sessionUser = session?.user

  const templateGridFetchAction: DeepImageGridFetchAction = async (
    query,
    page,
    pageSize,
  ) => {
    "use server"

    const templates = await getTemplates(query ?? "", page, pageSize, true)

    return templates.map((template) => template.image!)
  }

  return (
    <main className="flex flex-col items-center gap-8">
      <h1>Create Meme</h1>
      <CreateMemeForm
        sessionUserId={sessionUser?.id ?? null}
        templateGridFetchAction={templateGridFetchAction}
      />
    </main>
  )
}
