/**
 * Quick database verification script
 * Tests that all tables exist and have correct structure
 */
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../.env") });

async function verify() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("🔍 Verifying Neon database setup...\n");
  const sql = neon(databaseUrl);

  try {
    // 1. Check tables
    console.log("📋 Tables:");
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    tables.forEach((t: { table_name: string }) => console.log(`  ✓ ${t.table_name}`));

    // 2. Check each table structure
    console.log("\n📊 Table Structures:\n");
    
    for (const table of tables) {
      console.log(`${table.table_name}:`);
      const cols = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = ${table.table_name}
        ORDER BY ordinal_position
      `;
      cols.forEach((c: { column_name: string; data_type: string; is_nullable: string }) => {
        console.log(`  - ${c.column_name}: ${c.data_type} (${c.is_nullable === 'YES' ? 'nullable' : 'required'})`);
      });
      console.log();
    }

    // 3. Check indexes
    console.log("🔑 Indexes:");
    const indexes = await sql`
      SELECT indexname, tablename FROM pg_indexes 
      WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey'
      ORDER BY tablename, indexname
    `;
    indexes.forEach((i: { indexname: string; tablename: string }) => {
      console.log(`  ✓ ${i.tablename}: ${i.indexname}`);
    });

    // 4. Check triggers
    console.log("\n⚡ Triggers:");
    const triggers = await sql`
      SELECT trigger_name, event_object_table FROM information_schema.triggers
      WHERE trigger_schema = 'public'
    `;
    triggers.forEach((t: { trigger_name: string; event_object_table: string }) => {
      console.log(`  ✓ ${t.event_object_table}: ${t.trigger_name}`);
    });

    // 5. Row counts
    console.log("\n📈 Row Counts:");
    const tableNames = ['users', 'contact_submissions', 'newsletter_subscribers', 'user_preferences'];
    for (const tableName of tableNames) {
      const count = await sql`SELECT COUNT(*) as count FROM ${sql.unsafe(tableName)}`;
      console.log(`  ${tableName}: ${count[0].count} rows`);
    }

    console.log("\n✅ Database verification complete!");

  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

verify();
