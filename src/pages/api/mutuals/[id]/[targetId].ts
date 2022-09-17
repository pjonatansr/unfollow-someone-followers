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
  const bearerToken = accessToken as string;
  const twitterClient = await getTwitterClient();

  //TODO: treat cases following more than 1000 users
  // const followersUser = await twitterClient.v2.following(id as string, { max_results: 1000 });
  // const followersTarget = await twitterClient.v2.followers(targetId as string, { max_results: 1000 });

  res.status(200).json({
    mutuals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  })
}


