export const config = {
  'TWITTER_CLIENT_ID': process.env.TWITTER_CLIENT_ID || '',
  'TWITTER_CLIENT_SECRET': process.env.TWITTER_CLIENT_SECRET || '',
  'TWITTER_API_KEY': process.env.TWITTER_API_KEY || '',
  'TWITTER_API_KEY_SECRET': process.env.TWITTER_API_KEY_SECRET || '',
  'TWITTER_ACCESS_TOKEN': process.env.TWITTER_ACCESS_TOKEN || "",
  'TWITTER_ACCESS_TOKEN_SECRET': process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  'AUTH_SECRET': process.env.AUTH_SECRET || '',
} as const;