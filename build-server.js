import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: ['server/index.production.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  minify: true,
  packages: 'external',
  alias: {
    '@shared': path.resolve(__dirname, 'shared')
  },
  external: [
    'express',
    'ws',
    '@neondatabase/serverless',
    'pg',
    'drizzle-orm',
    'dotenv',
    'node-cron',
    'node-telegram-bot-api',
    '@google/generative-ai',
    'web-push',
    'xml2js',
    'express-session',
    'connect-pg-simple',
    'bcrypt',
    'passport',
    'passport-local',
    'zod',
    'zod-validation-error'
  ]
});

console.log('✅ Server build completed!');
