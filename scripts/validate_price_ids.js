#!/usr/bin/env node
/**
 * Validate a price-ids JSON mapping against the project's RECURRING_PLANS and MAIN_PACKAGE.
 * Usage: node ./scripts/validate_price_ids.js ./price-ids.json
 */
const fs = require('fs');
const path = require('path');

const mappingPath = process.argv[2];
if (!mappingPath) {
  console.error('Usage: node scripts/validate_price_ids.js ./price-ids.json');
  process.exit(1);
}

let mappingRaw;
try {
  mappingRaw = fs.readFileSync(mappingPath, 'utf-8');
} catch (err) {
  console.error('Could not read mapping file:', err.message);
  process.exit(1);
}

let mapping;
try {
  mapping = JSON.parse(mappingRaw);
} catch (err) {
  console.error('Invalid JSON:', err.message);
  process.exit(1);
}

const pricingFile = path.join(__dirname, '..', 'src', 'data', 'pricing.data.ts');
let pricingContent;
try {
  pricingContent = fs.readFileSync(pricingFile, 'utf-8');
} catch (err) {
  console.error('Could not read pricing data file:', err.message);
  process.exit(1);
}

// Extract plan names from pricing.data.ts using a simple regex
const planNameRegex = /name:\s*"([^"]+)"/g;
const names = new Set();
let m;
while ((m = planNameRegex.exec(pricingContent)) !== null) {
  names.add(m[1]);
}

const report = {
  errors: [],
  warnings: [],
  ok: []
};

Object.keys(mapping).forEach(plan => {
  if (!names.has(plan)) {
    report.warnings.push(`Mapping includes plan '${plan}' which is not present in pricing.data.ts`);
  }

  const mappingPrices = mapping[plan];
  if (!mappingPrices || (typeof mappingPrices !== 'object')) {
    report.errors.push(`Plan '${plan}' mapping is invalid`);
    return;
  }

  // For recurring plans we expect a monthly and yearly
  const monthly = mappingPrices.monthly || mappingPrices.month;
  const yearly = mappingPrices.yearly || mappingPrices.year;
  if (!monthly && !yearly) {
    report.errors.push(`Plan '${plan}' has no monthly or yearly price ID`);
  } else {
    if (monthly && !/^price_/.test(monthly)) {
      report.warnings.push(`Plan '${plan}' monthly price '${monthly}' does not look like a valid price_* id`);
    }
    if (yearly && !/^price_/.test(yearly)) {
      report.warnings.push(`Plan '${plan}' yearly price '${yearly}' does not look like a valid price_* id`);
    }
    report.ok.push(`Plan '${plan}' mapping ok`);
  }
});

// Check for missing payments for recurring known plans
names.forEach(name => {
  if (!Object.prototype.hasOwnProperty.call(mapping, name)) {
    report.warnings.push(`Pricing data contains plan '${name}' but mapping does not include it`);
  }
});

console.log('Validation results:');
if (report.errors.length) {
  console.error('\nErrors:');
  report.errors.forEach(e => console.error(' - ' + e));
}
if (report.warnings.length) {
  console.warn('\nWarnings:');
  report.warnings.forEach(e => console.warn(' - ' + e));
}
if (report.ok.length) {
  console.log('\nOk:');
  report.ok.forEach(e => console.log(' - ' + e));
}

if (report.errors.length) {
  process.exit(2);
} else if (report.warnings.length) {
  process.exit(0);
} else {
  console.log('All good.');
  process.exit(0);
}
