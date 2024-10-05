"use client"

import Input from "@/components/jsx/form/input/Input"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useFormState } from "react-dom"
import FormStateView from "../formStateView/FormStateView"
import { FormState } from "@/data/api/types/action/types"
import { postMeme } from "@/data/api/controllers/meme"
import { DeepImageGridFetchAction } from "../../grid/deepImageGrid/DeepImageGrid"
import { useContext, useRef, useState } from "react"
import { ProcessedImage } from "@/data/api/types/model/types"
import Image from "next/image"
import { getOneTemplate } from "@/data/api/controllers/template"
import { createMemeSchema } from "@/data/api/validation/meme"
import { SelectTemplateModal } from "../../modal/selectTemplateModal/SelectTemplateModal"
import { CreateMemeModal } from "../../modal/createMemeModal/CreateMemeModal"
import { ModalContext } from "../../context/ModalContext"

type CreateMemeFormProps = {
  sessionUserId: string | null
  templateGridFetchAction: DeepImageGridFetchAction
}

export default function CreateMemeForm({
  sessionUserId,
  templateGridFetchAction,
}: CreateMemeFormProps) {
  const { openModalId, setOpenModalId } = useContext(ModalContext)
  // When a modal is open, the openModalId state is set to its id.
  // Else, openModalId === null.
  const selectTemplateModalId = "select-template-modal"
  const createMemeModalId = "create-meme-modal"

  const formRef = useRef<HTMLFormElement | null>(null)
  const newTemplateImageRef = useRef<ProcessedImage | null>(null)

  const [template, setTemplate] = useState<{
    image: ProcessedImage
    lineCount: number
  } | null>(null)

  const [state, action] = useFormState<FormState, FormData>(
    postMeme.bind(null, template?.lineCount ?? null),
    false,
  )

  const [errors, setErrors] = useState<Record<
    string,
    string[] | undefined
  > | null>(null)

  if (
    typeof state === "object" &&
    "errors" in state &&
    state.errors !== errors
  ) {
    setOpenModalId(null)
    setErrors(state.errors)
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="flex w-full flex-col items-center gap-8"
      aria-label="Create meme"
    >
      <section className="flex w-full flex-col gap-4">
        <h2>Template</h2>
        <div className="flex">
          {template === null ? (
            <div className="flex aspect-square w-40 items-center justify-center border-2 border-stress-secondary text-center italic sm:w-52 md:w-64 lg:w-80">
              Template Appears Here
            </div>
          ) : (
            <Image
              src={template.image.base64}
              width={0}
              height={0}
              alt={template.image.alt}
              className="h-auto w-40 border-2 border-stress-secondary sm:w-52 md:w-64 lg:w-80 xl:w-96"
            />
          )}
          <button
            type="button"
            className="btn-secondary items-center rounded-s-none"
            aria-label="Search for a template"
            onClick={() => setOpenModalId(selectTemplateModalId)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
          {openModalId === selectTemplateModalId && (
            <SelectTemplateModal
              fetchAction={templateGridFetchAction}
              onTemplateSelect={(image) => {
                newTemplateImageRef.current = image
              }}
              onCancel={() => {
                newTemplateImageRef.current = null
                setOpenModalId(null)
              }}
              onConfirm={async () => {
                const image = newTemplateImageRef.current

                if (image === null) {
                  return
                }

                const template = await getOneTemplate(image.id)
                setTemplate({
                  image,
                  lineCount: template!.lines,
                })
                newTemplateImageRef.current = null
                setOpenModalId(null)
              }}
            />
          )}
        </div>
        <Input
          name="template-id"
          errors={errors?.template_id}
          attrs={{
            input: {
              type: "hidden",
              value: template?.image.id ?? "",
            },
          }}
        />
      </section>
      <section className="flex w-full flex-col gap-4">
        <h2>Text</h2>
        {template === null ? (
          <p>You must select a template before you can add text.</p>
        ) : (
          [...Array(template.lineCount)].map((line, index) => {
            const name = `line${index + 1}`

            return (
              <Input
                key={index}
                name={name}
                label={`Line ${index + 1}`}
                errors={errors?.[name]}
              />
            )
          })
        )}
      </section>
      {sessionUserId !== null && (
        <>
          <section className="flex w-full flex-col gap-4">
            <h2>Metadata</h2>
            <Input
              name="private"
              errors={errors?.private}
              attrs={{
                input: {
                  type: "checkbox",
                  value: "private",
                  className: "rounded-none",
                },
              }}
            />
          </section>
          <Input
            name="user-id"
            errors={errors?.user_id}
            attrs={{
              input: {
                type: "hidden",
                value: sessionUserId,
              },
            }}
          />
        </>
      )}
      <button
        type="button"
        className="btn-primary mb-4 w-1/2"
        onClick={async () => {
          const formData = new FormData(formRef.current!)
          const parseObject: Record<string, unknown> = {
            template_id: formData.get("template-id"),
            user_id: formData.get("user-id"),
            private: formData.get("private"),
          }

          if (template) {
            for (let i = 1; i < template.lineCount + 1; i++) {
              parseObject[`line${i}`] = formData.get(`line${i}`)
            }
          }

          const parse = await createMemeSchema(
            template?.lineCount ?? null,
            false,
          ).safeParseAsync(parseObject)

          if (!parse.success) {
            setErrors(parse.error.flatten().fieldErrors)
            return
          }

          setErrors(null)
          setOpenModalId(createMemeModalId)
        }}
      >
        Preview
      </button>
      <FormStateView state={state} />
      {openModalId === createMemeModalId && (
        <CreateMemeModal
          lineCount={template!.lineCount}
          formData={new FormData(formRef.current!)}
          onCancel={() => setOpenModalId(null)}
          onConfirm={() => {
            if (sessionUserId === null) {
              setOpenModalId(null)
            } else {
              formRef.current!.requestSubmit()
            }
          }}
          download={sessionUserId === null}
        />
      )}
    </form>
  )
}
