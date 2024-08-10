'use server'

import prisma from '../../prisma/client';
import { postBookmarkSchema } from '../validation/bookmark';
import { error500Msg } from '../validation/errorMsg';

export async function getOneBookmark(userId: string, memeId: string) {
    try {
        const bookmark = await prisma.bookmark.findUnique({
            where: { 
                user_id_meme_id: {
                    user_id: userId,
                    meme_id: memeId
                }
            },
        })
    
        return bookmark
    } 
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch bookmark.');
    }
}

export async function getUserBookmarks(userId: string) {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            include: { 
                meme: true
            },
            where: { 
                user_id: userId 
            },
        })
    
        return bookmarks
    } 
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch bookmarks.');
    }
}

export async function postBookmark(formData: FormData) {
    const parse = await postBookmarkSchema.safeParseAsync({
        user_id: formData.get('user_id'),
        meme_id: formData.get('meme_id')
    })
  
    if (!parse.success) {
        return
    }
  
    const { user_id, meme_id } = parse.data
  
    try {
      await prisma.bookmark.create({
        data: { user_id, meme_id }
      })
    }
    catch (error) {
      throw new Error(error500Msg)
    }
}