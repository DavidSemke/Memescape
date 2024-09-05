"use server"

import prisma from "../../prisma/client"
import { pageClause } from "../query/postWhere"
import { preWhereBookmarkQuery } from "../query/preWhere"
import { templateSearchPredicates, wordRegexes } from "../query/where"
import { JoinedBookmark, NestedBookmark } from "../types/model/types"
import { nestBookmark } from "../types/model/transforms"
import { postBookmarkSchema } from "../validation/bookmark"
import { error500Msg } from "../validation/errorMsg"

export async function getOneBookmark(
  userId: string,
  memeId: string,
): Promise<NestedBookmark | null> {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        user_id_meme_id: {
          user_id: userId,
          meme_id: memeId,
        },
      },
    })

    return bookmark
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch bookmark.")
  }
}

export async function getBookmarks(
  searchInput: string | null = null,
  page: number = 1,
  pageSize: number = 20,
  userId: string | undefined = undefined,
): Promise<NestedBookmark[]> {
  const querySegments = [preWhereBookmarkQuery()]
  const wherePredicates = []
  let regexes: string[] = []

  if (searchInput !== null) {
    regexes = wordRegexes(searchInput)

    if (regexes.length) {
      const searchPredicates = templateSearchPredicates(regexes.length).map(
        (p, i) => {
          p = p.slice(0, -1) // Remove closing bracket to add more
          // Check if word in meme text, a list of multi-word strings
          return (
            p +
            " OR EXISTS" +
            ` (SELECT 1 FROM unnest(m.text) AS line WHERE line ILIKE $${i + 1}))`
          )
        },
      )

      wherePredicates.push(`(${searchPredicates.join(" AND ")})`)
    }
    // If a user's search input is an empty string, no bookmarks should be fetched
    else {
      return []
    }
  }

  if (userId !== undefined) {
    wherePredicates.push(`b.user_id = '${userId}'`)
  }

  // Append where clause if exists
  if (wherePredicates.length) {
    querySegments.push(`WHERE ${wherePredicates.join(" AND ")}`)
  }

  querySegments.push("ORDER BY m.create_date DESC", pageClause(page, pageSize))

  try {
    const bookmarks = await prisma.$queryRawUnsafe<JoinedBookmark[]>(
      querySegments.join(" "),
      ...regexes,
    )
    return bookmarks.map(nestBookmark)
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch bookmarks.")
  }
}

export async function postBookmark(formData: FormData) {
  const parse = await postBookmarkSchema.safeParseAsync({
    user_id: formData.get("user_id"),
    meme_id: formData.get("meme_id"),
  })

  // Parse includes check for already existing duplicate bookmark
  if (!parse.success) {
    return
  }

  const { user_id, meme_id } = parse.data

  try {
    await prisma.bookmark.create({
      data: { user_id, meme_id },
    })
  } catch (error) {
    throw new Error(error500Msg)
  }
}
