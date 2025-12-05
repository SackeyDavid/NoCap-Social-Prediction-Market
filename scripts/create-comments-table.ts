import 'dotenv/config';
import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function createCommentsTable() {
    console.log('Creating comments table...');

    try {
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        market_id UUID NOT NULL REFERENCES markets(id),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
        console.log('Comments table created successfully!');
    } catch (error) {
        console.error('Error:', error);
    }

    process.exit(0);
}

createCommentsTable();
