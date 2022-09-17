import { Container, VStack } from "@chakra-ui/react"
import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import { TwitterUserCard } from "../components/TwitterUserCard"
import { TargetSearch } from "../components/TargetSearch"
import { getHttpProtocol } from "../getHttpProtocol"
import { TwitterUser } from "../types"
import { useState } from "react"
import { Mutuals } from "../components/Mutuals"
import { HomeWithoutAuth } from "@src/components/HomeWithoutAuth"

interface Props {
  userData: TwitterUser,
}

const UnfollowPage: NextPage<Props> = ({ userData }: Props) => {
  const [targetData, setTargetData] = useState<TwitterUser>({} as TwitterUser);

  if (!userData) return (<HomeWithoutAuth></HomeWithoutAuth>);
  const { id } = userData as TwitterUser;

  return (
    <Container
      w={'100vw'}
      p={0}
      pb={1}
    >
      <VStack
        alignItems={'flex-start'}
        p={[0, 1, 2, 3]}
      >
        <TwitterUserCard user={userData} />
        <TargetSearch targetUsername={targetData.username} setTargetData={setTargetData} />
        <TwitterUserCard user={targetData} reverse={true} />
        <Mutuals
          userId={id}
          targetId={targetData.id}
        />
      </VStack >
    </Container >
  )
};

export default UnfollowPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session || !!session?.error) {

    return {
      props: {}
    }
  }


  const username = session?.username as string;
  const userData: TwitterUser = await getUserData(ctx, username, session)

  return {
    props: {
      userData,
    },
  }

}

async function getUserData(ctx: any, username: string, session: any) {
  const host = ctx.req.headers.host as string
  const httpProtocol = getHttpProtocol(host)
  const userData: TwitterUser = await fetch(`${httpProtocol}://${host}/api/profile/${username}`, {
    headers: {
      'access-token': session?.access_token as string,
    }
  })
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      console.log({ error })
    })
  return userData;
}

