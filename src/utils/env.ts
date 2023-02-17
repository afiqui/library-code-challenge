// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = 'env:DATABASE_URL';
  process.env.REFRESH_TOKEN_SECRET = 'mockRefreshTokenSecret';
  process.env.GOOGLE_CLIENT_ID = '1000000000000.apps.googleusercontent.com';
  process.env.GOOGLE_CLIENT_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxx';
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(parsedEnv.error.format(), null, 4),
  );
  process.exit(1);
}
export const env = parsedEnv.data;
