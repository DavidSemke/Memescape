'use server'

import prisma from '../../prisma/client';

export async function getBookmarks(userId: string) {
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