import prisma from "../prisma/client"
import createUserImageData from "./create/createUserImageData"
import createMemeImageData from "./create/createMemeImageData"
import createUserData from "./create/createUserData"
import createTemplateData from "./create/createTemplateData"
import createMemeData from "./create/createMemeData"
import createBookmarkData from "./create/createBookmarkData"
import { Image, Template, User, Meme, Bookmark, Prisma } from "@prisma/client"
import { configDotenv } from "dotenv"
configDotenv()

async function seedTable<RecordType>(
  tableName: Uncapitalize<Prisma.ModelName>,
  records: RecordType[],
): Promise<RecordType[]> {
  try {
    const inserts = await Promise.all(
      records.map((record) =>
        (prisma[tableName] as any).create({ data: record }),
      ),
    )

    console.log(`Seeded ${inserts.length} ${tableName} records.`)

    return inserts
  } catch (error) {
    console.error(`Error seeding ${tableName} records:`, error)
    throw error
  }
}

async function clearTables() {
  const tables = ["Bookmark", "Meme", "Template", "User", "Image"]
  const tableString = tables.map((table) => `"${table}"`).join(", ")

  await prisma.$queryRawUnsafe("TRUNCATE " + tableString)
}

async function seed() {
  // Get meme images and templates from 3rd-party API
  // Meme image is type Image with some extra properties
  const [memeImages, templates] = await Promise.all([
    createMemeImageData(100),
    createTemplateData(),
  ])
  // Seed user profile images, meme product images, and templates
  const [seededUserImages] = await Promise.all([
    seedTable<Image>("image", createUserImageData()),
    seedTable<Image>(
      "image",
      memeImages.map((img) => {
        return { id: img.id, data: img.data, mime_type: img.mime_type }
      }),
    ),
    seedTable<Template>("template", templates),
  ])
  // Seed users, memes, and bookmarks
  const users = await createUserData(
    ["Alexus", "Barney", "Carrie"],
    seededUserImages,
  )
  const seededUsers = await seedTable<User>("user", users)
  const seededMemes = await seedTable<Meme>(
    "meme",
    createMemeData(memeImages, seededUsers, 40),
  )
  await seedTable<Bookmark>(
    "bookmark",
    createBookmarkData(seededUsers, seededMemes, 40, 10),
  )
}

async function main() {
  await clearTables()
  seed()
}

main()
