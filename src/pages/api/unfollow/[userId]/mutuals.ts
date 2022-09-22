import getTwitterClient from "@src/getTwitterClient";
import { TwitterUser, Error } from "@src/types";
import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

const unfollowUserMutualsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TwitterUser | Error>
) => {
  const { userId } = req.query;
  const { 'access-token': accessToken } = req.headers;

  const { ids } = JSON.parse(req.body);
  console.log({ unfollowedIds: ids });

  const { v2 }: TwitterApi = await getTwitterClient(accessToken as string);
  for (const id of (ids || [])) {
    try {
      await v2.unfollow(userId as string, id);
    } catch (e) {
      console.error({ e });
    }
  }

  res.status(200);
  return;
}

export default unfollowUserMutualsHandler;