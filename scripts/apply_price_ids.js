#!/usr/bin/env node
/*
 * apply_price_ids.js
 * Usage: node scripts/apply_price_ids.js ./price-ids.json
 * The price-ids.json should have a structure mapping plan names to price IDs, e.g.
 * {
 *   "Starter Spark": { "monthly": "price_...", "yearly": "price_..." },
 *   "Brand Pulse": { "monthly": "price_...", "yearly": "price_..." }
 * }
 * This script replaces matching plan stripePriceIds values in src/data/pricing.data.ts
 */

const fs = require('fs');
const path = require('path');

const mappingPath = process.argv[2];
if (!mappingPath) {
  console.error('Usage: node scripts/apply_price_ids.js ./price-ids.json');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
const dataFile = path.join(__dirname, '..', 'src', 'data', 'pricing.data.ts');
let content = fs.readFileSync(dataFile, 'utf-8');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

Object.keys(mapping).forEach(planName => {
  const mappingPrices = mapping[planName];

  // find the block with name: "Plan Name",
  const nameRegex = new RegExp(`name:\s*"${escapeRegExp(planName)}",`);
  const match = content.match(nameRegex);
  if (!match) {
    console.warn(`Plan name '${planName}' not found in pricing.data.ts; skipping`);
    return;
  }

  // Find the stripePriceIds object that follows this name occurrence
  const startIndex = match.index;
  // We'll search forward a chunk of the file to find the stripePriceIds block
  const snippet = content.slice(startIndex, startIndex + 800);
  const stripeRegex = /stripePriceIds:\s*\{[\s\S]*?\}/;
  const stripeMatch = snippet.match(stripeRegex);
  if (!stripeMatch) {
    console.warn(`stripePriceIds object not found near plan '${planName}'.`);
    return;
  }

  const stripeBlock = stripeMatch[0];
  const newStripeBlock = stripeBlock
    .replace(/monthly:\s*"[^"]*"/i, `monthly: "${mappingPrices.monthly || mappingPrices.month || ''}"`)
    .replace(/yearly:\s*"[^"]*"/i, `yearly: "${mappingPrices.yearly || mappingPrices.year || ''}"`);

  // Replace the stripe block in the file
  const snippetStart = startIndex;
  const snippetEnd = startIndex + stripeMatch.index + stripeMatch[0].length;
  const before = content.slice(0, snippetStart + stripeMatch.index);
  const after = content.slice(snippetStart + stripeMatch.index + stripeMatch[0].length);
  content = before + newStripeBlock + after;

  console.log(`Updated ${planName} stripe ids.`);
});

// Write the updated contents to a new file (backup original)
const backupPath = dataFile + '.bak';
fs.writeFileSync(backupPath, fs.readFileSync(dataFile, 'utf-8'), 'utf-8');
fs.writeFileSync(dataFile, content, 'utf-8');
console.log('Updated pricing.data.ts; backup saved to pricing.data.ts.bak');
console.log('Run tests / lint and review changes, then commit.');
