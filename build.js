#!/usr/bin/env node
import { build } from 'esbuild';
import { execSync } from 'child_process';

// Frontend ni build qilish
console.log('Building frontend...');
execSync('npm run vite:build', { stdio: 'inherit' });

// Backend ni vite dependencies larni exclud qilib build qilish
console.log('Building backend...');
await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  external: [
    'vite',
    '@vitejs/plugin-react', 
    '@replit/vite-plugin-cartographer',
    '@replit/vite-plugin-runtime-error-modal'
  ],
  packages: 'external'
});

console.log('Build completed successfully!');