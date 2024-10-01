"use client"

import Link from "next/link"
import { signInUser, postUser } from "@/data/api/controllers/user"
import { useFormState } from "react-dom"
import Input from "../input/Input"
import Logo from "../../image/Logo"
import { FormStateView } from "../FormStateView"
import { Action, FormState } from "@/data/api/types/action/types"

type SignFormProps = {
  signingUp?: boolean
}

export default function SignForm({ signingUp = false }: SignFormProps) {
  let heading = "Sign In"
  let bottomText = "Don't have an account?"
  let otherSignPath = "/sign-up"
  let otherSignHeading = "Sign Up"
  let signAction: Action = signInUser

  if (signingUp) {
    heading = "Sign Up"
    bottomText = "Already have an account?"
    otherSignPath = "/sign-in"
    otherSignHeading = "Sign In"
    signAction = postUser
  }

  const [state, action] = useFormState<FormState, FormData>(signAction, false)
  const errors =
    typeof state === "object" && "errors" in state ? state.errors : null

  return (
    <form
      action={action}
      className="flex w-full flex-col items-center gap-4"
      aria-label={heading}
    >
      <header className="flex items-center justify-center gap-4">
        <Logo />
        <h1 className="text-2xl">{heading}</h1>
      </header>
      <Input name="username" errors={errors?.username} />
      <Input
        name="password"
        errors={errors?.password}
        attrs={{
          input: {
            type: "password",
          },
        }}
      />
      <button type="submit" className="btn-primary">
        {heading}
      </button>
      <FormStateView state={state} />

      <div className="flex flex-col items-center">
        <p className="text-sm">{bottomText}</p>
        <Link href={otherSignPath} className="text-sm">
          {otherSignHeading}
        </Link>
      </div>
    </form>
  )
}
