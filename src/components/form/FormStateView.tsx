'use client'

import { FormState } from "@/data/api/types/action/types"
import { useFormStatus } from "react-dom"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"

type FormStateViewProps = {
    state: FormState,
    setOuterPending?: Dispatch<SetStateAction<boolean>>
}

/*
    Show the state of the form submission process. If state is a string,
    then it is a message that relates to the entire form instead of 
    individual fields.
*/
export function FormStateView({ state, setOuterPending=undefined }: FormStateViewProps) {
    const { pending } = useFormStatus()
    
    if (pending) {
        if (setOuterPending) {
            setOuterPending(true)
        }

        return <p className="text-pending text-center">Pending...</p>
    }

    if (setOuterPending) {
        setOuterPending(false)
    }
    
    if (state === false) {
        // Typically only true when form has not yet been submitted
        return null
    }
 
    let Icon = CheckCircleIcon
    let msg = 'Submission accepted!'
    let msgColor = 'text-success'
    
    if (typeof state === 'string') {
        msg = state
    }
    else if (state !== true) {
        // State is an object with errors listed by field.
        // These errors are shown outside of this component.
        Icon = XCircleIcon
        msg = 'Submission rejected.'
        msgColor = 'text-error'
    }

    return (
        <div className="flex gap-2 items-center justify-center">
            <Icon className={`w-6 h-6 ${msgColor}`} />
            <p className={`${msgColor}`}>{msg}</p>
        </div>
    )
}