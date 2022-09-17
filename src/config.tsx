export const config = {
  'TWITTER_CLIENT_ID': process.env.TWITTER_CLIENT_ID as string,
  'TWITTER_CLIENT_SECRET': process.env.TWITTER_CLIENT_SECRET as string,
  'TWITTER_API_KEY': process.env.TWITTER_API_KEY as string,
  'TWITTER_API_KEY_SECRET': process.env.TWITTER_API_KEY_SECRET as string,
  'TWITTER_ACCESS_TOKEN': process.env.TWITTER_ACCESS_TOKEN as string,
  'TWITTER_ACCESS_TOKEN_SECRET': process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  'AUTH_SECRET': process.env.AUTH_SECRET as string,
} as const;