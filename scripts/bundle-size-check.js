#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 * 
 * Analyzes build output and warns if bundle sizes exceed thresholds.
 * Run after `npm run build` to check bundle sizes.
 * 
 * Usage: node scripts/bundle-size-check.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle size thresholds (in KB)
const THRESHOLDS = {
  main: 500,      // Main bundle
  vendor: 300,    // Third-party libraries
  total: 800,     // Total bundle size
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2);
}

function checkBundleSize() {
  const distPath = path.join(__dirname, '..', 'dist', 'assets');
  
  if (!fs.existsSync(distPath)) {
    console.error(`${colors.red}❌ Build directory not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  const files = fs.readdirSync(distPath);
  
  let mainSize = 0;
  let vendorSize = 0;
  let totalSize = 0;
  let warnings = [];

  console.log(`\n${colors.cyan}📦 Bundle Size Analysis${colors.reset}\n`);
  console.log('━'.repeat(60));

  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = formatSize(stats.size);
    
    if (file.endsWith('.js')) {
      totalSize += stats.size;
      
      if (file.includes('index-')) {
        mainSize += stats.size;
        console.log(`${colors.blue}📄 Main:${colors.reset} ${file} (${sizeKB} KB)`);
      } else if (file.includes('vendor-')) {
        vendorSize += stats.size;
        console.log(`${colors.blue}📦 Vendor:${colors.reset} ${file} (${sizeKB} KB)`);
      } else {
        console.log(`${colors.blue}📄 Chunk:${colors.reset} ${file} (${sizeKB} KB)`);
      }
    }
  });

  console.log('━'.repeat(60));

  const mainSizeKB = formatSize(mainSize);
  const vendorSizeKB = formatSize(vendorSize);
  const totalSizeKB = formatSize(totalSize);

  // Check thresholds
  if (mainSize / 1024 > THRESHOLDS.main) {
    warnings.push(`Main bundle (${mainSizeKB} KB) exceeds threshold (${THRESHOLDS.main} KB)`);
  }
  
  if (vendorSize / 1024 > THRESHOLDS.vendor) {
    warnings.push(`Vendor bundle (${vendorSizeKB} KB) exceeds threshold (${THRESHOLDS.vendor} KB)`);
  }
  
  if (totalSize / 1024 > THRESHOLDS.total) {
    warnings.push(`Total bundle (${totalSizeKB} KB) exceeds threshold (${THRESHOLDS.total} KB)`);
  }

  // Display summary
  console.log(`\n${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Main Bundle:   ${mainSizeKB} KB`);
  console.log(`  Vendor Bundle: ${vendorSizeKB} KB`);
  console.log(`  Total Size:    ${totalSizeKB} KB`);

  // Display warnings
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}`);
    warnings.forEach(warning => {
      console.log(`  ${colors.yellow}•${colors.reset} ${warning}`);
    });
    console.log(`\n${colors.yellow}Consider optimizing your bundle size.${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}✅ All bundle sizes are within thresholds!${colors.reset}\n`);
  }

  // Recommendations
  if (warnings.length > 0) {
    console.log(`${colors.cyan}Recommendations:${colors.reset}`);
    console.log(`  1. Use lazy loading for routes and heavy components`);
    console.log(`  2. Remove unused dependencies`);
    console.log(`  3. Use tree-shaking for large libraries`);
    console.log(`  4. Replace heavy libraries with lighter alternatives`);
    console.log(`  5. Use code splitting for large features\n`);
  }
}

checkBundleSize();
