import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function reset() {
  const sql = neon(process.env.DATABASE_URL!);
  console.log("⏳ Dropping all tables...");
  
  // Danger: This wipes the entire public schema
  await sql`DROP SCHEMA public CASCADE;`;
  await sql`CREATE SCHEMA public;`;
  await sql`GRANT ALL ON SCHEMA public TO public;`;
  
  console.log("✅ Database emptied. Now run: npx drizzle-kit push");
  process.exit(0);
}

reset();

