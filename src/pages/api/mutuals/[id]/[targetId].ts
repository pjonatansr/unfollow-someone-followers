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
  const twitterClient = await getTwitterClient();

  //TODO: treat cases following more than 1000 users
  const following = await getUserFollowing(twitterClient, id as string);
  const followers = await getUserFollowers(twitterClient, targetId as string);

  const mutuals = following.filter((user: any) => followers.some((follower: any) => follower.id === user.id));

  res.status(200).json({
    mutuals
  })
}

async function getUserFollowing(twitterClient: any, id: string, next_token: string = ''): Promise<any[]> {
  const result: any[] = [];
  const { data, meta } = await twitterClient.v2.following(id, { max_results: 1000, next_token: next_token || null });
  result.push(...data);

  try {
    if (!!meta?.next_token) {
      const nextResult = await getUserFollowing(twitterClient, id, meta.next_token);
      result.push(...nextResult);
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

async function getUserFollowers(twitterClient: any, id: string, next_token: string = ''): Promise<any[]> {
  const result: any[] = [];
  const { data, meta } = await twitterClient.v2.followers(id, { max_results: 1000, next_token: next_token || null });
  result.push(...data);

  try {
    if (!!meta?.next_token) {
      const nextResult = await getUserFollowers(twitterClient, id, meta.next_token);
      result.push(...nextResult);
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}
