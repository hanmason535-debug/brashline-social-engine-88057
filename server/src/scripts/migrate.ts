/**
 * Database migration script
 * Executes SQL migrations against Neon database
 */
import { config } from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
config({ path: join(__dirname, "../../../.env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration(): Promise<void> {
  console.log("🚀 Starting database migration...\n");
  
  try {
    // Create UUID extension
    console.log("1. Enabling UUID extension...");
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log("   ✅ UUID extension ready\n");
    
    // Create users table
    console.log("2. Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        image_url TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("   ✅ users table created\n");
    
    // Create contact_submissions table
    console.log("3. Creating contact_submissions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("   ✅ contact_submissions table created\n");
    
    // Create newsletter_subscribers table
    console.log("4. Creating newsletter_subscribers table...");
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        unsubscribed_at TIMESTAMP WITH TIME ZONE
      )
    `;
    console.log("   ✅ newsletter_subscribers table created\n");
    
    // Create user_preferences table
    console.log("5. Creating user_preferences table...");
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
        language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
        email_notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("   ✅ user_preferences table created\n");
    
    // Create indexes
    console.log("6. Creating indexes...");
    const indexes = [
      { name: "idx_users_clerk_id", sql: sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)` },
      { name: "idx_users_email", sql: sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)` },
      { name: "idx_contact_submissions_user_id", sql: sql`CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON contact_submissions(user_id)` },
      { name: "idx_contact_submissions_created_at", sql: sql`CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC)` },
      { name: "idx_contact_submissions_status", sql: sql`CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status)` },
      { name: "idx_newsletter_subscribers_email", sql: sql`CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email)` },
      { name: "idx_newsletter_subscribers_status", sql: sql`CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status)` },
      { name: "idx_user_preferences_user_id", sql: sql`CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id)` },
    ];
    
    for (const idx of indexes) {
      await idx.sql;
      console.log(`   ✅ ${idx.name}`);
    }
    console.log();
    
    // Create updated_at trigger function
    console.log("7. Creating trigger function...");
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    console.log("   ✅ update_updated_at_column() function created\n");
    
    // Create triggers
    console.log("8. Creating triggers...");
    await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`;
    await sql`
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log("   ✅ update_users_updated_at trigger");
    
    await sql`DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences`;
    await sql`
      CREATE TRIGGER update_user_preferences_updated_at
      BEFORE UPDATE ON user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log("   ✅ update_user_preferences_updated_at trigger\n");
    
    // Verify tables
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📋 VERIFICATION\n");
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log("Tables created:");
    for (const t of tables) {
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = ${t.table_name}
        ORDER BY ordinal_position
      `;
      console.log(`\n  📁 ${t.table_name}`);
      for (const col of columns) {
        console.log(`     - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
      }
    }
    
    console.log("\n\n✅ Migration completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
