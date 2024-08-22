'use client'

import { FormState } from "@/data/api/types/action/types"
import { useFormStatus } from "react-dom"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

type FormStateViewProps = {
    state: FormState
}

/*
    Show the state of the form submission process. If state is a string,
    then it is a message that relates to the entire form instead of 
    individual fields.
*/
export function FormStateView({ state }: FormStateViewProps) {    
    const { pending } = useFormStatus()
    
    if (pending) {
        return <p className="text-pending text-center">Pending...</p>
    }

    if (state === false) {
        // Typically only true when form has not yet been submitted
        return null
    }

    // In the default case, state is an object with errors listed by field.
    // These errors are shown outside of this component.
    let Icon = XCircleIcon
    let msg = 'Submission rejected.'
    let msgColor = 'text-error'

    if (state === true) {
        Icon = CheckCircleIcon
        msg = 'Submission accepted!'
        msgColor = 'text-success'
    }
    else if (typeof state === 'string') {
        msg = state
    }

    return (
        <div className="flex gap-2 items-center justify-center">
            <Icon className={`w-6 h-6 ${msgColor}`} />
            <p className={`${msgColor}`}>{msg}</p>
        </div>
    )
}