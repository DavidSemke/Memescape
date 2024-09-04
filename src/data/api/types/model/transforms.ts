import { 
    ProcessedImage,
    JoinedMeme,
    NestedMeme,
    JoinedBookmark,
    NestedBookmark,
    JoinedUser,
    NestedUser,
    NestedTemplate
} from './types';
import { isNestedMeme, isNestedUser } from './guards';
import { isNestedBookmark } from './guards';
import { Image, Template } from '@prisma/client';
import { base64String, bufferFromBase64, isPlainObject } from '../../utils';

export function nestBookmark(bookmark: JoinedBookmark) {
    const nestedMeme = nestMeme(bookmark)
    const nestedBookmark: NestedBookmark = {
        user_id: bookmark.b_user_id,
        meme_id: bookmark.b_meme_id,
        meme: nestedMeme
    }
    
    if (!isNestedBookmark(nestedBookmark)) {
        throw new Error('Value is not of type NestedBookmark')
    }

    return nestedBookmark
}

/*
    If JoinedBookmark is argument, a NestedMeme object is extracted.
    Argument joinedItem is read-only. 
*/
export function nestMeme(
    joinedItem: JoinedMeme | JoinedBookmark
): NestedMeme {
    let product_image: Record<string, unknown> = {}
    const template: Record<string, unknown> = {}
    let profile_image: Record<string, unknown> = {}
    const user: Record<string, unknown> = {}
    const nestedMeme: Record<string, any> = {
        user,
        template,
        product_image,
    }
    
    let key: keyof JoinedMeme

    for (key in joinedItem) {
        if (key.startsWith('m_')) {
            const nestedKey = key.slice(2)
            nestedMeme[nestedKey] = joinedItem[key]
        }
        else if (key.startsWith('mi_')) {
            const nestedKey = key.slice(3)
            product_image[nestedKey] = joinedItem[key]
        }
        else if (key.startsWith('t_')) {
            const nestedKey = key.slice(2)
            template[nestedKey] = joinedItem[key]
        }
        else if (key.startsWith('u_')) {
            const nestedKey = key.slice(2)
            user[nestedKey] = joinedItem[key]
        }
        else if (key.startsWith('ui_')) {
            const nestedKey = key.slice(3)
            profile_image[nestedKey] = joinedItem[key]
        }
    }

    for (const key in nestedMeme) {
        // Empty object means corresponding relation not in join
        if (
            isPlainObject(nestedMeme[key])
            && Object.keys(nestedMeme[key]).length === 0
        ) {
            delete nestedMeme[key]
        }
        else if (key === 'product_image') {
            product_image = processImageNoAlt(product_image as Image)
            product_image.alt = memeAlt(
                nestedMeme.template!.name, 
                nestedMeme.text
            )
            product_image.downloadName = memeDownloadName(
                template.name as string,
                product_image.mime_type as string
            )
            product_image.linkId = nestedMeme.id
            nestedMeme[key] = product_image
        }
        else if (key === 'user' && profile_image.id !== null) {
            // User is part of join
            // User should be nested with processed profile image
            profile_image = processImageNoAlt(profile_image as Image)
            profile_image.alt = `${user.u_name}'s profile picture.`
            nestedMeme[key].profile_image = profile_image
        }
    }

    if (isNestedMeme(nestedMeme)) {
        return nestedMeme
    }

    throw new TypeError('Value is not of type NestedMeme')
}

export function nestUser(user: JoinedUser): NestedUser {
    const nestedUser: Record<string, unknown> = {
        id: user.u_id,
        name: user.u_name,
        password: user.u_password,
        profile_image_id: user.u_profile_image_id
      }
  
      // If ui_id field is null, profile image does not exist
      if (user.ui_id) {
        const image: Record<string, unknown> = processImageNoAlt({
            id: user.ui_id,
            data: user.ui_data,
            mime_type: user.ui_mime_type
        } as Image)

        image.alt = `${user.u_name}'s profile picture.`
        nestedUser.profile_image = image
      }
  
      if (isNestedUser(nestedUser)) {
        return nestedUser
      }
  
      throw new TypeError('Value is not of type NestedUser')
}

export async function nestTemplate(template: Template): Promise<NestedTemplate> {
    const factoryRes = await fetch(
        `https://api.memegen.link/templates/${template.id}`
    )

    if (!factoryRes.ok) {
        throw new Error(`Response status: ${factoryRes.status}`);
    }

    const factoryTemplate = await factoryRes.json()
    const imageUrl = factoryTemplate.blank
    const imageRes = await fetch(imageUrl)
    const buffer = Buffer.from(await imageRes.arrayBuffer())
    
    const split = imageUrl.split('.')
    let ext = split[split.length-1]

    if (ext === 'jpg') {
        ext = 'jpeg'
    }

    const mime_type = `image/${ext}`

    return {
        ...template,
        lines: factoryTemplate.lines,
        image: {
            ...processImageNoAlt({ 
                id: template.id,
                data: buffer,
                mime_type 
            }),
            alt: template.name
        }
    }
}

// Alt omitted because it depends on greater context, where greater context 
// is meme, template, user, ...
// Property downloadName is optional and omitted since it only applies to 
// certain images (e.g. meme images).
export function processImageNoAlt(image: Image): Omit<ProcessedImage, 'alt'> {
    return {
        id: image.id,
        mime_type: image.mime_type,
        base64: base64String(
            image.data, 
            image.mime_type
        )
    }
}

export function unprocessImage(image: ProcessedImage): Image {
    return {
        id: image.id,
        mime_type: image.mime_type,
        data: bufferFromBase64(image.base64)
    }
}

export function memeDownloadName(
    templateName: string,
    mime_type: string
) {
    return [
        templateName,
        mime_type.split('/')[1]
    ].join('.').replaceAll(' ', '-')
}

export function memeAlt(
    templateName: string,
    memeText: string[]
) {
    return [
        templateName, 
        memeText.join('. ')
    ].join('. ')
}