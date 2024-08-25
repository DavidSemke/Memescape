import { User, Image, Meme, Template, Bookmark } from '@prisma/client'

export type NestedTemplate = Template
    & Partial<{
        image: ProcessedImage
    }>

export type NestedBookmark = Bookmark
    & Partial<{ 
        meme: NestedMeme,
        user: NestedUser
    }>

export type JoinedBookmark = PrefixedBookmark
    & Partial<PrefixedMeme>
    & Partial<PrefixedTemplate>
    & Partial<PrefixedUser>
    & Partial<PrefixedMemeImage>
    & Partial<PrefixedUserImage>

export type NestedUser = User
    & Partial<{ profile_image: ProcessedImage }>

export type JoinedUser = PrefixedUser 
    & Partial<PrefixedUserImage>

export type NestedMeme = Meme
    & Partial<{ 
        product_image: ProcessedImage,
        template: Template,
        user: NestedUser,
    }>

export type JoinedMeme = PrefixedMeme
    & Partial<PrefixedTemplate>
    & Partial<PrefixedUser>
    & Partial<PrefixedMemeImage>
    & Partial<PrefixedUserImage>

export type MemeImage = Image & {
    template_id: string,
    text: string[]
}

export type ProcessedImage = {
    id: string,
    mime_type: string,
    base64: string,
    alt: string
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
type PrefixedBookmark = PrefixProperties<Bookmark, 'b_'>