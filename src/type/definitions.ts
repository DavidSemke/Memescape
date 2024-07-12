export type User = {
    name: string,
    password: string,
    profile_image: Buffer | null
}

export type Meme = {
    id: number,
    template_id: number,
    user_id: string,
    top_text: string | null,
    bottom_text: string | null,
    private: boolean,
    product_image: Buffer,
    create_date: Date
}

export type Template = {
    id: number,
    image: Buffer,
    keywords: string[]
}

export type MemeBookmark = {
    id: number,
    user_id: string,
    meme_id: number | null
}

export type TemplateBookmark = {
    id: number,
    user_id: string,
    template_id: number | null
}