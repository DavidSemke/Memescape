import { object, string, instanceof as z_instanceof } from "zod"
import { minMaxErrorMap } from "./errorMsg"
import { getUserByName } from '../controllers/user'

const usernameLen = { min: 6, max: 20 }
const usernameRegex = /^[-\dA-Za-z]*$/
// It is assumed that illegal names are lowercase
const illegalNames = [
    'memes',
    'sign-in',
    'sign-up',
    'anonymous'
]

const passwordLen = { min: 8, max: 32 }
const passwordSpecialChars = "!@#$%^&*"

const validProfilePicTypes = [
    'png', 'jpeg', 'webp'
]
const maxUploadSize = 1024 * 1024 // 1MB

export const postUserSchema = object({
    username: validateUsername(null),
    password: string({ 
        errorMap: minMaxErrorMap(passwordLen)
    })
    .trim()
    .min(passwordLen.min)
    .max(passwordLen.max)
    .refine(
        (value) => {
            const containsNum = /\d/
            const containsSpecialChar = new RegExp(`[${passwordSpecialChars}]`)
            return containsNum.test(value) && containsSpecialChar.test(value)
        },
        { message: `Password must contain one of ${passwordSpecialChars} and a digit.` }
    )
})

export function createPutUserSchema(currUsername: string) {
    return object({
        username: validateUsername(currUsername),
        profileImage: z_instanceof(File)
            .optional()
            .refine((file) => {
                    return !file || file.size <= maxUploadSize
                }, 
                'File size must be at most 1MB.'
            )
            .refine(file => {
                    return (
                        !file 
                        || validProfilePicTypes.map(
                            ext => `image/${ext}`
                        ).includes(file.type)
                    )
                },
                'File must be a '
                    + validProfilePicTypes.slice(0, -1).join(', ')
                    + `, or ${validProfilePicTypes[validProfilePicTypes.length-1]}.`
            )
    })
}

function validateUsername(currUsername: string | null) {
    return string({ 
        errorMap: minMaxErrorMap(usernameLen)
    })
    .trim()
    .min(usernameLen.min)
    .max(usernameLen.max)
    .refine(
        (value) => usernameRegex.test(value),
        { message: "Username must only contain alphanumeric characters and '-'." }
    )
    .refine(
        (value) => !illegalNames.includes(value.toLowerCase()),
        { message: "Username already taken." }
    )
    .refine(
        async (value) => {
            if (currUsername && currUsername === value) {
                return true
            }

            return !(await getUserByName(value.toLowerCase()))
        },
        { message: "Username already taken." }
    )
}

export const signInUserSchema = object({
    username: string({ 
        required_error: "Username is required"
    })
    .trim(),
    password: string({ 
        required_error: "Password is required",
    })
    .trim()
})