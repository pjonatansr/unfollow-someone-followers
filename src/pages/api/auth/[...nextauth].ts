import NextAuth, { Account, Profile, User } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { config } from '../../../config';
import { JWT } from 'next-auth/jwt';
import axios, { AxiosResponse } from 'axios';

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

    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: config.TWITTER_CLIENT_ID,
    });

    const response: AxiosResponse = await axios.post(url, data, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const refreshedTokens: any = await response.data;

    if (response.status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in ?? 0) * 1000,
    };

  } catch (error: any) {
    console.error({ error });

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  secret: config.AUTH_SECRET,
  callbacks: {
    async session({ session, token }: any) {
      session.user = token.user;
      session.access_token = token.access_token;
      session.error = token.error;

      return Promise.resolve(session);
    },
    async jwt({ token, account = {}, profile, user }: JWTParams) {
      if (user) {
        if (!!Object.keys(account).length) {
          const tokenUser = {
            ...user,
            username: (profile?.data as any)?.username
          };
          const { refresh_token, access_token, expires_at } = account as {
            refresh_token: string;
            access_token: string;
            expires_at: number;
          };

          const accessTokenExpires = expires_at * 1000;

          return {
            user: tokenUser,
            access_token,
            refresh_token,
            accessTokenExpires,
          };
        }
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
