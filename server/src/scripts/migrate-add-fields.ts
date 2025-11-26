/**
 * Migration: Add extra fields to contact_submissions and newsletter_subscribers
 */
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../.env") });

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("🚀 Running migration: Add extra fields...");
  const sql = neon(databaseUrl);

  try {
    // Add columns to contact_submissions
    console.log("Adding columns to contact_submissions...");
    
    // Check if columns exist before adding
    const contactCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'contact_submissions' AND column_name IN ('phone', 'service_type', 'source', 'metadata')
    `;
    const existingContactCols = contactCols.map((r: { column_name: string }) => r.column_name);
    
    if (!existingContactCols.includes('phone')) {
      await sql`ALTER TABLE contact_submissions ADD COLUMN phone VARCHAR(20)`;
      console.log("  ✓ Added phone column");
    }
    if (!existingContactCols.includes('service_type')) {
      await sql`ALTER TABLE contact_submissions ADD COLUMN service_type VARCHAR(50)`;
      console.log("  ✓ Added service_type column");
    }
    if (!existingContactCols.includes('source')) {
      await sql`ALTER TABLE contact_submissions ADD COLUMN source VARCHAR(50) DEFAULT 'website'`;
      console.log("  ✓ Added source column");
    }
    if (!existingContactCols.includes('metadata')) {
      await sql`ALTER TABLE contact_submissions ADD COLUMN metadata JSONB`;
      console.log("  ✓ Added metadata column");
    }

    // Add columns to newsletter_subscribers
    console.log("Adding columns to newsletter_subscribers...");
    
    const newsletterCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'newsletter_subscribers' AND column_name IN ('name', 'source', 'metadata')
    `;
    const existingNewsletterCols = newsletterCols.map((r: { column_name: string }) => r.column_name);
    
    if (!existingNewsletterCols.includes('name')) {
      await sql`ALTER TABLE newsletter_subscribers ADD COLUMN name VARCHAR(100)`;
      console.log("  ✓ Added name column");
    }
    if (!existingNewsletterCols.includes('source')) {
      await sql`ALTER TABLE newsletter_subscribers ADD COLUMN source VARCHAR(50) DEFAULT 'website'`;
      console.log("  ✓ Added source column");
    }
    if (!existingNewsletterCols.includes('metadata')) {
      await sql`ALTER TABLE newsletter_subscribers ADD COLUMN metadata JSONB`;
      console.log("  ✓ Added metadata column");
    }

    console.log("\n✅ Migration completed successfully!");
    
    // Show updated table structures
    console.log("\n📊 Updated contact_submissions columns:");
    const updatedContactCols = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'contact_submissions' 
      ORDER BY ordinal_position
    `;
    updatedContactCols.forEach((col: { column_name: string; data_type: string; is_nullable: string }) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    console.log("\n📊 Updated newsletter_subscribers columns:");
    const updatedNewsletterCols = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'newsletter_subscribers' 
      ORDER BY ordinal_position
    `;
    updatedNewsletterCols.forEach((col: { column_name: string; data_type: string; is_nullable: string }) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
