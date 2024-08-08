import { User, Image, Meme, Template } from '@prisma/client'

export type NestedUser = User
    & { profile_image: ProcessedImage | null }

export type JoinedUser = PrefixedUser 
    & PrefixedUserImage

export type NestedMeme = Meme
    & { 
        product_image: ProcessedImage,
        template: Template,
        user: NestedUser,
    }

export type JoinedMeme = PrefixedMeme
    & PrefixedTemplate
    & PrefixedUser
    & PrefixedMemeImage
    & PrefixedUserImage

export type MemeImage = Image & {
    template_id: string,
    text: string[]
}

type ProcessedImage = {
    id: string,
    base64: string
}

// Utility type; prefix properties of a type
type PrefixProperties<T, Prefix extends string> = {
    [K in keyof T as `${Prefix}${K & string}`]: T[K];
};

// Use prefixes to prevent col name clashes on joins
type PrefixedUserImage = PrefixProperties<Image, 'ui_'>
type PrefixedMemeImage = PrefixProperties<Image, 'mi_'>
type PrefixedUser = PrefixProperties<User, 'u_'>
type PrefixedTemplate = PrefixProperties<Template, 't_'>
type PrefixedMeme = PrefixProperties<Meme, 'm_'>


/* Type guards */

function isProcessedImage(value: any): value is ProcessedImage {
    return (
        value 
        && typeof value.id === 'string'
        && typeof value.base64 === 'string'
    );
}

function isTemplate(value: any): value is Template {
    return (
        value 
        && typeof value.id === 'string'
        && typeof value.name === 'string'
        && Array.isArray(value.keywords)
        && value.keywords.every(
            (item: unknown) => typeof item === "string"
        )
    );
}

export function isNestedUser(value: any): value is NestedUser {
    return (
        value 
        && typeof value.id === 'string' 
        && typeof value.name === 'string'
        && typeof value.password === 'string'
        && (
            value.profile_image === null
            || isProcessedImage(value.profile_image)
        )
    );
}

export function isNestedMeme(value: any): value is NestedMeme {
    return (
        value 
        && typeof value.id === 'string' 
        && typeof value.template_id === 'string' 
        && typeof value.user_id === 'string' 
        && Array.isArray(value.text)
        && value.text.every(
            (item: unknown) => typeof item === "string"
        )
        && typeof value.private === 'boolean' 
        && typeof value.product_image_id === 'string' 
        && value.create_date instanceof Date
        && isProcessedImage(value.product_image) 
        && isTemplate(value.template) 
        && isNestedUser(value.user)
    );
}