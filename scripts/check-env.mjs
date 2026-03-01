#!/usr/bin/env node
/**
 * Debug script: verify .env loading.
 * Run: node scripts/check-env.mjs
 */
import { loadEnv } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();
const envPath = resolve(cwd, '.env');

console.log('cwd:', cwd);
console.log('.env exists:', existsSync(envPath));

if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  console.log('.env first 80 chars:', JSON.stringify(raw.slice(0, 80)));
  console.log('.env has BOM:', raw.charCodeAt(0) === 0xfeff);
}

const env = loadEnv(process.env.NODE_ENV || 'development', cwd, '');
console.log('loadEnv keys:', Object.keys(env));
console.log('PUBLIC_SANITY_PROJECT_ID:', env.PUBLIC_SANITY_PROJECT_ID ?? '(undefined)');
