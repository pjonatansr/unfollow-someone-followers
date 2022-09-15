import { TwitterApi } from 'twitter-api-v2';

import { config } from './config';

const configValidator = (keys: string[]): boolean =>
  keys.reduce((valid: boolean, key: string) => {
    if (!config.hasOwnProperty(key)) {
      console.error(`${key} is missing`);
      return false;
    }

    return valid;
  }, true);

const getTwitterClient = async (bearer_token?: string): Promise<TwitterApi> => {
  if (!!bearer_token) {
    return new TwitterApi(bearer_token)
  }

  const neededKeys = [
    'TWITTER_API_KEY',
    'TWITTER_API_KEY_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_TOKEN_SECRET',
  ];

  if (!configValidator(neededKeys)) throw 'Missing config keys';

  const client = new TwitterApi({
    appKey: config.TWITTER_API_KEY,
    appSecret: config.TWITTER_API_KEY_SECRET,
    accessToken: config.TWITTER_ACCESS_TOKEN,
    accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
  });

  return client;
};

export default getTwitterClient;
