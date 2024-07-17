export type User = {
    id: string,
    name: string,
    password: string,
    profile_image_id: string
}

export type Meme = {
    id: string,
    template_id: string,
    user_id: string,
    text: string[],
    private: boolean,
    product_image_id: string,
    create_date: Date
}

export type Bookmark = {
    user_id: string,
    meme_id: string | null
}

export type Template = {
    id: string,
    name: string,
    keywords: string[]
}

export type Image = {
    id: string,
    data: Buffer,
    mime_type: string
}