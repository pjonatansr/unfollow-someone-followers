import type { NextApiRequest, NextApiResponse } from 'next'
import getTwitterClient from '../../../../../getTwitterClient';
import { resizeTwitterProfileImage } from '../../../../../resizeTwitterProfileImage';

type Data = {
  targetData: any;
}

export default async function targetHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id, targetUsername } = req.query;
  const { 'access-token': accessToken } = req.headers;
  const bearer_token = accessToken as string;

  const twitterClient = await getTwitterClient(bearer_token);

  const { data } = await twitterClient.v2.userByUsername(targetUsername as string, {
    'user.fields': 'profile_image_url,name',
  });

  //TODO: treat cases following more than 1000 users
  // const followersUser = await twitterClient.v2.following(id as string, { max_results: 1000 });
  // const followersTargetUser = await twitterClient.v2.following(targetId, { max_results: 1000 });

  res.status(200).json({
    targetData: {
      id: data.id,
      username: data.username,
      profile_image_url: resizeTwitterProfileImage(data?.profile_image_url),
      name: data.name,
    }
  })
}

