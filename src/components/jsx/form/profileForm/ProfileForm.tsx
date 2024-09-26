"use client"

import { useFormState } from "react-dom"
import Input from "../Input"
import { putUser } from "@/data/api/controllers/user"
import { FormState } from "@/data/api/types/action/types"
import { NestedUser } from "@/data/api/types/model/types"
import { useEffect, useState } from "react"
import { PencilIcon } from "@heroicons/react/24/outline"
import { FormStateView } from "../FormStateView"

type ProfileFormProps = {
  user: NestedUser
  profileView: React.ReactNode
}

export default function ProfileForm({ user, profileView }: ProfileFormProps) {
  const [isGone, setIsGone] = useState<boolean>(true)
  const [showStateView, setShowStateView] = useState<boolean>(true)
  const [pending, setPending] = useState<boolean>(false)
  const [state, action] = useFormState<FormState, FormData>(putUser, false)

  useEffect(() => {
    if (state !== true || pending) {
      return
    }

    const timeoutId = setTimeout(() => {
      setIsGone(true)
      setShowStateView(false)
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [state, pending])

  if (isGone) {
    return (
      <div className="flex items-stretch gap-4">
        {profileView}
        <button
          type="button"
          className="btn-secondary items-center"
          onClick={() => setIsGone(false)}
          aria-label="Open profile form"
        >
          <PencilIcon className="h-6 w-6" />
        </button>
      </div>
    )
  }

  const errors =
    typeof state === "object" && "errors" in state ? state.errors : null

  return (
    <form
      action={action}
      className="flex flex-col gap-4"
      onSubmit={() => setShowStateView(true)}
      aria-label="Update profile"
    >
      <Input
        name="profile-image"
        errors={errors?.profileImage}
        attrs={{
          input: {
            type: "file",
          },
        }}
      />
      <Input
        name="username"
        errors={errors?.username}
        attrs={{
          input: {
            defaultValue: user.name,
          },
        }}
      />
      <div className="flex justify-center gap-8">
        <button type="submit" className="btn-primary">
          Submit
        </button>
        <button
          type="reset"
          className="btn-primary"
          onClick={() => setIsGone(true)}
        >
          Cancel
        </button>
      </div>
      {showStateView && (
        <FormStateView state={state} setOuterPending={setPending} />
      )}
    </form>
  )
}
