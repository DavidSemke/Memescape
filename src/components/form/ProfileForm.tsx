'use client'

import { useFormState } from "react-dom"
import { Input } from "./Input"
import { putUser } from "@/data/api/controllers/user"
import { FormState } from "@/data/api/types/action/types"
import { NestedUser } from "@/data/api/types/model/types"
import { ReactNode, useState } from "react"

type ProfileFormProps = {
    user: NestedUser,
    profileView: ReactNode
}

export default function ProfileForm({ user, profileView }: ProfileFormProps) {
    const [isGone, setIsGone] = useState<boolean>(true)
    const [state, action] = useFormState<FormState, FormData>(putUser, false)

    if (isGone) {
        return (
            <div className="flex items-center gap-4 mb-4">
                {profileView}
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsGone(false)}
                >
                    Edit
                </button>
            </div>
        )
    }

    const errors = typeof state === "object" && "errors" in state ? state.errors : null

    return (
        <form 
            action={action}
            className='flex flex-col gap-4 mb-4'
        >
            <Input 
                name='profile-pic'
                errors={errors?.profilePic}
                attrs={{
                    label: {
                        className: 'font-semibold'
                    },
                    input: {
                        type: 'file'
                    }
                }}
            />
            <Input 
                name='username'
                errors={errors?.username}
                attrs={{
                    label: {
                        className: 'font-semibold'
                    },
                    input: {
                        defaultValue: user.name
                    }
                }}
            />
            <Input 
                name='id'
                attrs={{
                    input: {
                        type: 'hidden',
                        defaultValue: user.id
                    }
                }}
            />
            <div className="flex justify-center gap-8">
                <button 
                    type='submit' 
                    className="btn-primary"
                >
                    Submit
                </button>
                <button 
                    type='reset' 
                    className="btn-primary"
                    onClick={() => setIsGone(true)}
                >
                    Cancel
                </button> 
            </div>
        </form>
    )
}