import { User, Meme, Bookmark } from "@prisma/client";

/*
    Users are given ${bookmarksPerUser} bookmarks until a user gets leftovers. 
    Leftovers can be more ore less than the value of bookmarksPerUser.
    If bookmarksPerUser is null, bookmarks are split evenly.
    Private memes are not bookmarked.
    Users can bookmark their own memes.
*/
export default function createBookmarkData(
    users: User[], 
    memes: Meme[], 
    count=10, 
    bookmarksPerUser: number | null = null, 
    bookmarklessUser=true
): Bookmark[] {
    // Prevent bookmark of private meme
    memes = memes.filter(meme => !meme.private)

    if (count < 1) {
        throw new Error('Need at least one bookmark.')
    }

    if (users.length === 0 || memes.length === 0) {
        throw new Error('Num of users/memes must be greater than zero.')
    }

    if (bookmarksPerUser !== null && bookmarksPerUser < 1) {
        throw new Error('Bookmarks per user must be null or at least 1.')
    }

    if (bookmarklessUser) {
        // Let first user have no bookmarks
        users = users.slice(1)

        if (users.length === 0) {
            throw new Error('Not enough users for bookmark distribution.')
        }
    }

    if (bookmarksPerUser === null) {
        // Impossible for users.length === 0
        // At least 1 bookmark per user
        bookmarksPerUser = Math.max(1, Math.floor(count / users.length))
    }

    const bookmarks: Bookmark[] = []
    let userIndex = 0
    let memeIndex = 0
    
    for(let i=0; i<count; i++, memeIndex = (memeIndex+1) % memes.length) {
        // Remaining bookmarks after distribution go to last user
        if (
            i !== 0 &&
            i % bookmarksPerUser === 0 
            && userIndex < users.length-1
        ) {
            userIndex += 1
        }

        const user = users[userIndex]
        const meme = memes[memeIndex]
        bookmarks.push({
            user_id: user.id,
            meme_id: meme.id
        })
    }

    return bookmarks
}