import { object, string } from "zod"
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

export const postUserSchema = object({
    username: validateUsername(),
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

// export const putUserSchema = object({
//     username: validateUsername(),
//     profileImage: 
// })


function validateUsername() {
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
        async (value) => !(await getUserByName(value.toLowerCase())),
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