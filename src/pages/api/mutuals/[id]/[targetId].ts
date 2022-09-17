import type { NextApiRequest, NextApiResponse } from 'next'
import getTwitterClient from '../../../../getTwitterClient';

type Data = {
  mutuals: any[];
}

export default async function targetHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id, targetId } = req.query;
  const { 'access-token': accessToken } = req.headers;
  const twitterClient = await getTwitterClient(accessToken as string);

  const following = await getUsers('following')(twitterClient, id as string);
  const followers = await getUsers('followers')(twitterClient, targetId as string);

  const mutuals = following.filter((user: any) => followers.some((follower: any) => follower.id === user.id));

  res.status(200).json({
    mutuals
  })
}

const getUsers = (fn: 'following' | 'followers') => {
  return async (twitterClient: any, id: string, next_token: string = ''): Promise<any[]> => {
    const result: any[] = [];

    const config: Partial<{
      max_results: number;
      pagination_token: string
    }> = {
      max_results: 1000,
    };

    if (!!next_token) {
      config.pagination_token = next_token;
    }

    const { v2 } = twitterClient
    const { data, meta } = await v2[fn](id, config);

    result.push(...data);

    try {
      if (!!meta?.next_token) {
        const endpointFn = getUsers(fn);
        const nextResult = await endpointFn(twitterClient, id, meta.next_token);
        result.push(...nextResult);
      }
    } catch (error: any) {
      console.error(error, error?.data?.errors);
    }

    return result;

  }
}