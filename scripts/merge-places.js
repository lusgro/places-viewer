#!/usr/bin/env node
/**
 * Merge multiple Apify Google Places scrapes into a single JSON file.
 * - Deduplicates by placeId
 * - Keeps the most recent scrapedAt version if duplicate
 * - Sorts by title alphabetically
 */

const fs = require('fs');
const path = require('path');

// Configuration - add files to merge here
const FILES_TO_MERGE = [
  'src/data/places.json',
  'dataset_crawler-google-places_2026-01-30_18-04-11-353.json',
  'dataset_crawler-google-places_2026-01-30_18-08-24-013.json',
];

const OUTPUT_FILE = 'src/data/places.json';
const BACKUP_FILE = 'src/data/places.backup.json';

function loadJson(filepath) {
  try {
    const fullPath = path.resolve(process.cwd(), filepath);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    console.log(`✓ Loaded ${filepath}: ${data.length} places`);
    return data;
  } catch (err) {
    console.error(`✗ Failed to load ${filepath}:`, err.message);
    return [];
  }
}

function mergePlaces(files) {
  const placeMap = new Map();
  let totalRaw = 0;
  let duplicatesSkipped = 0;
  let duplicatesUpdated = 0;

  for (const file of files) {
    const places = loadJson(file);
    totalRaw += places.length;

    for (const place of places) {
      if (!place.placeId) {
        console.warn(`⚠ Skipping place without placeId: ${place.title || 'unknown'}`);
        continue;
      }

      const existing = placeMap.get(place.placeId);
      
      if (!existing) {
        placeMap.set(place.placeId, place);
      } else {
        // Keep the one with more recent scrapedAt
        const existingDate = new Date(existing.scrapedAt || 0);
        const newDate = new Date(place.scrapedAt || 0);
        
        if (newDate > existingDate) {
          placeMap.set(place.placeId, place);
          duplicatesUpdated++;
        } else {
          duplicatesSkipped++;
        }
      }
    }
  }

  const merged = Array.from(placeMap.values());
  
  // Sort by title alphabetically
  merged.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'es'));

  console.log('\n=== MERGE SUMMARY ===');
  console.log(`Total raw places: ${totalRaw}`);
  console.log(`Duplicates skipped (older): ${duplicatesSkipped}`);
  console.log(`Duplicates updated (newer): ${duplicatesUpdated}`);
  console.log(`Final unique places: ${merged.length}`);
  console.log(`New places added: ${merged.length - 350}`); // 350 was original count

  return merged;
}

function main() {
  console.log('🔄 Starting merge process...\n');

  // Create backup
  const currentPath = path.resolve(process.cwd(), OUTPUT_FILE);
  const backupPath = path.resolve(process.cwd(), BACKUP_FILE);
  
  if (fs.existsSync(currentPath)) {
    fs.copyFileSync(currentPath, backupPath);
    console.log(`📦 Backup created: ${BACKUP_FILE}\n`);
  }

  // Merge
  const merged = mergePlaces(FILES_TO_MERGE);

  // Write output
  fs.writeFileSync(currentPath, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`\n✅ Merged data written to: ${OUTPUT_FILE}`);

  // Show category breakdown
  const categories = {};
  for (const place of merged) {
    const cat = place.categoryName || '(sin categoría)';
    categories[cat] = (categories[cat] || 0) + 1;
  }
  
  console.log('\n=== CATEGORIES ===');
  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCats.slice(0, 15)) {
    console.log(`  ${cat}: ${count}`);
  }
  if (sortedCats.length > 15) {
    console.log(`  ... and ${sortedCats.length - 15} more categories`);
  }
}

main();
