export type Action = (
    state: FormState, formData: FormData
) => Promise<FormState> | FormState

// If true, form submitted successfully.
// If false, form has not yet been submitted.
// If string, full form error occurred.
// If object, form field errors occurred.
export type FormState = boolean
 | string
 | { errors: Record<string, string[]> }