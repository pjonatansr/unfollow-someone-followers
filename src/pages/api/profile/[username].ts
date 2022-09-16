import { userProfile } from "@src/modules/userProfile";
import { TwitterUser, Error } from "@src/types";
import { NextApiRequest, NextApiResponse } from "next";

const userProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TwitterUser | Error>
) => {
  const username: string = req.query.username as string;
  const { 'access-token': accessToken } = req.headers;

  await userProfile(accessToken as string, username)
    .then(({ data }) => {
      res.status(200).json(data)
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Oops! Something went wrong."
      })
    })
}

export default userProfileHandler;