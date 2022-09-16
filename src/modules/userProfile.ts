import { resizeTwitterProfileImage } from '@src/resizeTwitterProfileImage';
import getTwitterClient from '../getTwitterClient';

export async function userProfile(bearerToken: string, username: string | string[] | undefined): Promise<{ data: any; }> {
  const twitterClient = await getTwitterClient(bearerToken);
  const { data } = await twitterClient.v2.userByUsername(username as string, {
    'user.fields': 'profile_image_url,name,public_metrics',
  });

  const profile = {
    ...data,
    profile_image_url: resizeTwitterProfileImage(data.profile_image_url),
  }

  return { data: profile };
}
