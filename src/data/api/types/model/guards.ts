import { 
    ProcessedImage,
    NestedBookmark,
    NestedUser,
    NestedMeme 
} from "./types";
import { Template } from "@prisma/client";

function isProcessedImage(value: any): value is ProcessedImage {
    return (
        value 
        && typeof value.id === 'string'
        && typeof value.mime_type === 'string'
        && typeof value.base64 === 'string'
        && typeof value.alt === 'string'
        && (
            value.downloadName === undefined
            || typeof value.downloadName === 'string'
        )
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
        && typeof value.lines === 'number'
    );
}

export function isNestedUser(value: any): value is NestedUser {
    return (
        value 
        && typeof value.id === 'string' 
        && typeof value.name === 'string'
        && typeof value.password === 'string'
        && (
            value.profile_image_id === null
            || typeof value.profile_image_id === 'string'
        )
        && (
            value.profile_image === undefined
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
        && (
            value.product_image === undefined
            || isProcessedImage(value.product_image)
        )
        && (
            value.template === undefined
            || isTemplate(value.template)
        )
        && (
            value.user === undefined
            || isNestedUser(value.user)
        )
    );
}

export function isNestedBookmark(value: any): value is NestedBookmark {
    return (
        value 
        && typeof value.user_id === 'string' 
        && typeof value.meme_id === 'string'
        && (
            value.user === undefined
            || isNestedUser(value.user)
        )
        && (
            value.meme === undefined
            || isNestedMeme(value.meme)
        )
    );
}