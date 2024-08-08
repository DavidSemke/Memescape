import prisma from './prisma/client'
import createUserImageData from './placeholder/createUserImageData'
import createMemeImageData from './placeholder/createMemeImageData'
import createUserData from './placeholder/createUserData'
import createTemplateData from './placeholder/createTemplateData'
import createMemeData from './placeholder/createMemeData'
import createBookmarkData from './placeholder/createBookmarkData'
import { configDotenv } from 'dotenv'
import { Image, Template, User, Meme, Bookmark, Prisma } from '@prisma/client'
configDotenv()

// async function seedImages(
//   memeImages: MemeImage[]
// ): Promise<{ user: Image[], meme: Image[] }> {
//   try {
//     // define promise lists
//     const userImages = createUserImageData()
//     const userPromises = userImages.map(
//       (image) => prisma.image.create({ data: image })
//     )
//     const memePromises = memeImages.map(
//       (image) => {
//         const { id, data, mime_type } = image
//         return prisma.image.create(
//           { data: { id, data, mime_type } }
//         )
//       }
//     )

//     // Seed user profile images
//     const insertedImages = await Promise.all([
//       ...userPromises,
//       ...memePromises
//     ])

//     console.log(
//       `Seeded ${insertedImages.length} images`
//     );

//     return {
//       user: insertedImages.slice(0, userImages.length),
//       meme: insertedImages.slice(userImages.length)
//     }
//   }
//   catch (error) {
//     console.error('Error seeding images:', error);
//     throw error;
//   }
// }

async function seedTable<RecordType>(
  tableName: Uncapitalize<Prisma.ModelName>, records: RecordType[]
): Promise<RecordType[]> {
  try {
    const inserts = await Promise.all(
      records.map(record => (prisma[tableName] as any).create({ data: record }))
    )
    
    console.log(`Seeded ${inserts.length} ${tableName} records.`);

    return inserts
  } 
  catch (error) {
    console.error(`Error seeding ${tableName} records:`, error);
    throw error;
  }
}

// async function seedUsers(profileImages: Image[]): Promise<User[]> {
//   try {
//     const users = createUserData(profileImages)
//     const insertedUsers = await Promise.all(
//       users.map(async (user) => {
//         user.password = await bcrypt.hash(user.password, 10)
//         return prisma.user.create({ data: user }) 
//       })
//     )

//     console.log(`Seeded ${insertedUsers.length} users`);

//     return insertedUsers
//   } 
//   catch (error) {
//     console.error('Error seeding users:', error);
//     throw error;
//   }
// }

// async function seedMemes(
//   memeImages: MemeImage[], users: User[]
// ): Promise<Meme[]> {
//   try {
//     const memes = createMemeData(memeImages, users, 40)
//     const insertedMemes = await Promise.all(
//       memes.map(meme => prisma.meme.create({ data: meme }))
//     )
    
//     console.log(`Seeded ${insertedMemes.length} memes`);

//     return insertedMemes
//   } 
//   catch (error) {
//     console.error('Error seeding memes:', error);
//     throw error;
//   }
// }

// async function seedBookmarks(): Promise<Bookmark[]> {
//   try {
//     const bookmarks 
//     const insertedBookmarks = await Promise.all(
//       bookmarks.map((bookmark) => prisma.bookmark.create({ data: bookmark }) )
//     );

//     console.log(`Seeded ${insertedBookmarks.length} bookmarks`);

//     return insertedBookmarks
//   } 
//   catch (error) {
//     console.error('Error seeding bookmarks:', error);
//     throw error;
//   }
// }

// async function seedTemplates(templates: Template[]): Promise<Template[]> {
//   try {
//     const insertedTemplates = await Promise.all(
//       templates.map((template) => prisma.template.create({ data: template }))   
//     )

//     console.log(`Seeded ${insertedTemplates.length} templates`);

//     return insertedTemplates
//   } 
//   catch (error) {
//     console.error('Error seeding templates:', error);
//     throw error;
//   }
// }

async function clearTables() {
  const tables = ['Bookmark', 'Meme', 'Template', 'User', 'Image']
  const tableString = tables.map(table => `"${table}"`).join(', ')

  await prisma.$queryRawUnsafe(
    'TRUNCATE ' + tableString
  )
}

async function seed() {
  // Get meme images and templates from 3rd-party API
  // Meme image is type Image with some extra properties
  const [memeImages, templates] = await Promise.all([
    createMemeImageData(100),
    createTemplateData(),
  ])
  // Seed user profile images, meme product images, and templates
  const [ seededUserImages ] = await Promise.all([
    seedTable<Image>('image', createUserImageData()),
    seedTable<Image>('image', memeImages.map(img => {
      return { id: img.id, data: img.data, mime_type: img.mime_type }
    })),
    seedTable<Template>('template', templates)
  ])
  // Seed users, memes, and bookmarks
  const users = await createUserData(seededUserImages)
  const seededUsers = await seedTable<User>('user', users);
  const seededMemes = await seedTable<Meme>(
    'meme', 
    createMemeData(
      memeImages,
      seededUsers,
      40
    )
  );
  await seedTable<Bookmark>(
    'bookmark', createBookmarkData(seededUsers, seededMemes, 40, 10)
  );
}

async function main() {
  await clearTables()
  seed()
}

main()