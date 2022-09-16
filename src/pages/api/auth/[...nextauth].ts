import NextAuth, { Account, Profile, User } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { config } from '../../../config';
import { JWT } from 'next-auth/jwt';
import { ControlBox } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

export type JWTToken = JWT & {
  refresh_token?: string;
  accessTokenExpires?: number;
};

export interface JWTParams {
  token: JWTToken;
  user?: User | undefined;
  account?: Account | Record<string, unknown> | undefined;
  profile?: Profile | undefined;
  isNewUser?: boolean | undefined;
}

async function refreshAccessToken(token: JWTToken) {
  const { refresh_token } = token;

  if (!refresh_token) {
    return token;
  }

  try {
    const url = 'https://api.twitter.com/2/oauth2/token';

    const credentials = Buffer.from(
      `${config.TWITTER_CLIENT_ID}:${config.TWITTER_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: config.TWITTER_CLIENT_ID,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    });

    console.log({ a: { ...config } })

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in ?? 0) * 1000,
      error: '',
    };
  } catch (errorData) {
    console.error({ error: errorData });

    return {
      ...token,
      error: '',
    };
  }
}

export default NextAuth({
  secret: config.AUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      return { ...session, ...token };
    },
    async jwt({ token, account = {}, profile, user }: JWTParams) {
      if (account && user) {
        const { username } = profile?.data as { username?: string };
        const { refresh_token, access_token, expires_at } = account as {
          refresh_token: string;
          access_token: string;
          expires_at: number;
        };

        const accessTokenExpires = 1000;

        return {
          ...token,
          username,
          access_token,
          refresh_token,
          accessTokenExpires,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
  },
  providers: [
    TwitterProvider({
      clientId: config.TWITTER_CLIENT_ID,
      clientSecret: config.TWITTER_CLIENT_SECRET,
      version: '2.0',
      authorization: {
        url: 'https://twitter.com/i/oauth2/authorize',
        params: {
          scope: 'users.read tweet.read offline.access tweet.write follows.read follows.write',
        },
      },
    }),
  ],
});
