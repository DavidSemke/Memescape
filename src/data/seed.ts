import prisma from './prisma/client'
import images from './placeholder/images'
import users from './placeholder/users'
import memes from './placeholder/memes'
import bookmarks from './placeholder/bookmarks'
import templates from './placeholder/templates'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'
configDotenv()

async function seedImages() {
  try {
    const insertedImages = await Promise.all(
      images.map((image) => prisma.image.create({ data: image })) 
    )

    console.log(`Seeded ${insertedImages.length} images`);
  }
  catch (error) {
    console.error('Error seeding images:', error);
    throw error;
  }
}

async function seedUsers() {
  try {
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        user.password = await bcrypt.hash(user.password, 10)
        return prisma.user.create({ data: user }) 
      })
    )

    console.log(`Seeded ${insertedUsers.length} users`);
  } 
  catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedMemes() {
  try {
    const insertedMemes = await Promise.all(
      memes.map((meme) => prisma.meme.create({ data: meme }))
    )
    
    console.log(`Seeded ${insertedMemes.length} memes`);
  } 
  catch (error) {
    console.error('Error seeding memes:', error);
    throw error;
  }
}

async function seedBookmarks() {
  try {
    const insertedBookmarks = await Promise.all(
      bookmarks.map((bookmark) => prisma.bookmark.create({ data: bookmark }) )
    );

    console.log(`Seeded ${insertedBookmarks.length} bookmarks`);
  } 
  catch (error) {
    console.error('Error seeding bookmarks:', error);
    throw error;
  }
}

async function seedTemplates() {
  try {
    const insertedTemplates = await Promise.all(
      templates.map((template) => prisma.template.create({ data: template }))   
    )

    console.log(`Seeded ${insertedTemplates.length} templates`);
  } 
  catch (error) {
    console.error('Error seeding templates:', error);
    throw error;
  }
}

async function main() {
  await seedImages();
  await seedUsers();
  await seedTemplates();
  await seedMemes();
  await seedBookmarks();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});