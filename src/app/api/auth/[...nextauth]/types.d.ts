import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            name: string,
            password: string,
            profile_image_id: string,
            profile_image?: {
                id: string,
                data: Buffer,
                mime_type: string
            },
            profile_image_base64?: string
        }
    } 
}