#!/usr/bin/env node
/**
 * Re-save .env as UTF-8. Run if other tools fail to read your .env.
 * Usage: node scripts/fix-env-encoding.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env');
let raw = '';
try {
  raw = readFileSync(envPath, 'utf8');
  if (!raw.includes('\u0000')) {
    console.log('.env is already UTF-8, no change needed.');
    process.exit(0);
  }
} catch {
  try {
    raw = readFileSync(envPath, 'utf16le');
  } catch (e) {
    console.error('Could not read .env:', e.message);
    process.exit(1);
  }
}
writeFileSync(envPath, raw, 'utf8');
console.log('.env converted to UTF-8.');
