import { Button, Container, VStack, Box, HStack } from "@chakra-ui/react"
import { GetServerSideProps, NextPage } from "next"
import { getSession, signIn, useSession } from "next-auth/react"
import { TwitterUserCard } from "../components/TwitterUserCard"
import { TargetSearch } from "../components/TargetSearch"
import { getHttpProtocol } from "../getHttpProtocol"
import { TwitterUser } from "../types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface Props {
  userData: TwitterUser,
}

const UnfollowPage: NextPage<Props> = ({ userData }: Props) => {
  const { id } = userData as TwitterUser;
  const [targetData, setTargetData] = useState<TwitterUser>({} as TwitterUser);
  const [mutuals, setMutuals] = useState<any[]>([]);

  useEffect(() => {
    const handleClick = async (
      id: string,
      targetId: string,
      setMutuals: Dispatch<SetStateAction<TwitterUser[]>>,
    ) => {
      console.log("effect??");
      await fetch(`/api/mutuals/${id}/${targetId}`)
        .then((res) => res.json())
        .then((data) => {
          setMutuals(data)
        });
    };

    if (!id || !targetData?.id) {
      console.log("no id or targetId");
      return;
    }

    handleClick(id, targetData.id, setMutuals);
  }, [id, targetData.id, setMutuals]);


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
        <TargetSearch targetUsername={''} setTargetData={setTargetData} />
        <TwitterUserCard user={targetData} reverse={true} />
        <HStack
          w={'100%'}
          justifyContent={'center'}
        >

        </HStack>
      </VStack >
    </Container>
  )
};

export default UnfollowPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session?.id || session?.error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const username = session?.username as string;
  const userData: TwitterUser = await getUserData(ctx, username, session)
  const { targetUsername } = ctx.query;

  if (!targetUsername) {
    return {
      props: {
        userData,
      },
    }
  }

  const targetData: TwitterUser = await getUserData(ctx, targetUsername as string, session)

  return {
    props: {
      userData,
      targetData: targetData || {},
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

