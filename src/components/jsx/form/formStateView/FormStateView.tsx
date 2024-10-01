"use client"

import { FormState } from "@/data/api/types/action/types"
import { useFormStatus } from "react-dom"
import { useEffect } from "react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"

type FormStateViewProps = {
  state: FormState
  setOuterPending?: Dispatch<SetStateAction<boolean>>
}

/*
    Show the state of the form submission process. If state is a string,
    then it is a message that relates to the entire form instead of 
    individual fields.
    Param setOuterPending is necessary since useFormStatus hook must be called 
    from a component within the form (cannot lift pending state up).
*/
export default function FormStateView({
  state,
  setOuterPending = undefined,
}: FormStateViewProps) {
  const { pending } = useFormStatus()

  useEffect(() => {
    if (setOuterPending) {
      setOuterPending(pending)
    }
  }, [pending])

  if (pending) {
    return <p className="text-center text-pending">Pending...</p>
  }

  if (state === false) {
    // Typically only true when form has not yet been submitted
    return null
  }

  // By default, it is assumed that state is an object with
  // errors listed by field.
  // These errors are shown outside of this component.
  let Icon = XCircleIcon
  let msg = "Submission rejected."
  let msgColor = "text-error"

  if (typeof state === "string") {
    // State is an error string.
    // Error targets form as a whole, not individual fields.
    msg = state
  } else if (state === true) {
    Icon = CheckCircleIcon
    msg = "Submission accepted!"
    msgColor = "text-success"
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Icon className={`h-6 w-6 ${msgColor}`} />
      <p className={`${msgColor}`}>{msg}</p>
    </div>
  )
}
