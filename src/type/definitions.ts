export type User = {
    id: number,
    name: string,
    password: string,
    profile_image: Buffer | null
}

export type Meme = {
    id: number,
    template_id: string,
    user_id: number,
    text: string[],
    private: boolean,
    product_image: Buffer,
    create_date: Date
}

export type Bookmark = {
    id: number,
    user_id: number,
    meme_id: number | null
}

export type Template = {
    id: string,
    name: string,
    lines: number,
    keywords: string[]
}