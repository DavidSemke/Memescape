import { User, Image, Meme, Template } from '@prisma/client'

export type NestedJoinedUser = User
    & Partial<{ profile_image: Image }>

export type JoinedUser = User 
    & Partial<Omit<Image, 'id'>>

export type NestedJoinedMeme = Meme
    & { 
        product_image: Image,
        template: Template
    }

export type JoinedMeme = Meme
    & Omit<Image, 'id'>
    & Omit<Template, 'id'>

export type Action = (
    state: FormState, formData: FormData
) => Promise<FormState> | FormState

// If true, form submitted successfully.
// If false, form has not yet been submitted.
// If string, full form error occurred.
// If object, field errors occurred.
export type FormState = boolean
 | string
 | { errors: Record<string, string[]> }