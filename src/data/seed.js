const { db } = require('@vercel/postgres');
const users = require('./placeholder/users');
const memes = require('./placeholder/memes');
const bookmarks = require('./placeholder/bookmarks');
const templates = require('./placeholder/templates');
const bcrypt = require('bcrypt');
require('dotenv').config()

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        profile_image BYTEA
      );
    `;

    console.log(`Created "users" table`);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users 
          VALUES (${user.id}, ${user.name}, ${hashedPassword}, ${user.profile_image});
        `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedMemes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS memes (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        template_id VARCHAR(30) NOT NULL,
        user_id UUID NOT NULL,
        text VARCHAR(60)[] NOT NULL,
        private BOOLEAN NOT NULL,
        product_image BYTEA NOT NULL,
        create_date DATE NOT NULL,
        CONSTRAINT fk_template
          FOREIGN KEY(template_id)
            REFERENCES templates(id),
        CONSTRAINT fk_user
          FOREIGN KEY(user_id)
            REFERENCES users(id)
      );
    `;

    console.log(`Created "memes" table`);

    const insertedMemes = await Promise.all(
      memes.map(
        (meme) => client.sql`
          INSERT INTO memes
          VALUES (${meme.id}, ${meme.template_id}, ${meme.user_id}, ${meme.text}, 
          ${meme.private}, ${meme.product_image}, ${meme.create_date});
        `,
      ),
    );

    console.log(`Seeded ${insertedMemes.length} memes`);

    return {
      createTable,
      memes: insertedMemes,
    };
  } catch (error) {
    console.error('Error seeding memes:', error);
    throw error;
  }
}

async function seedBookmarks(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        user_id UUID NOT NULL,
        meme_id UUID NOT NULL,
        PRIMARY KEY(user_id, meme_id),
        CONSTRAINT fk_user
          FOREIGN KEY(user_id)
            REFERENCES users(id),
        CONSTRAINT fk_meme
          FOREIGN KEY(meme_id)
            REFERENCES memes(id)
      );
    `;

    console.log(`Created "bookmarks" table`);

    const insertedBookmarks = await Promise.all(
      bookmarks.map(
        (bookmark) => client.sql`
        INSERT INTO bookmarks
        VALUES (${bookmark.user_id}, ${bookmark.meme_id});
      `,
      ),
    );

    console.log(`Seeded ${insertedBookmarks.length} bookmarks`);

    return {
      createTable,
      bookmarks: insertedBookmarks,
    };
  } catch (error) {
    console.error('Error seeding bookmarks:', error);
    throw error;
  }
}

async function seedTemplates(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS templates (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        lines SMALLINT NOT NULL,
        keywords VARCHAR(60)[] NOT NULL
      );
    `;

    console.log(`Created "templates" table`);

    const insertedTemplates = await Promise.all(
      templates.map(
        (template) => client.sql`
        INSERT INTO templates
        VALUES (${template.id}, ${template.name}, ${template.lines}, 
        ${template.keywords});
      `,
      ),
    );

    console.log(`Seeded ${insertedTemplates.length} templates`);

    return {
      createTable,
      templates: insertedTemplates,
    };
  } catch (error) {
    console.error('Error seeding templates:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedTemplates(client);
  await seedMemes(client);
  await seedBookmarks(client);
  
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});