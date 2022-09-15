import { Container, VStack } from "@chakra-ui/react"
import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import { TwitterUserCard } from "../components/TwitterUserCard"
import { TargetSearch } from "../components/TargetSearch"
import { getHttpProtocol } from "../getHttpProtocol"
import { TwitterUser } from "../types"
import { resizeTwitterProfileImage } from "../resizeTwitterProfileImage"

interface Props {
  userData: TwitterUser,
  targetData?: TwitterUser,

}

const UnfollowPage: NextPage<Props> = ({ userData, targetData }: Props) => {
  return (
    <Container
      w={'100vw'}
      p={0}
    >
      <VStack
        alignItems={'flex-start'}
        p={[0, 1, 2, 3]}
      >
        <TwitterUserCard user={userData} />
        <TargetSearch id={userData?.id} />
        <TwitterUserCard user={targetData} reverse={true} />

      </VStack >
    </Container>
  )
}

export default UnfollowPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const userData = {
    username: session?.username,
    profile_image_url: resizeTwitterProfileImage(session?.user?.image as string),
    name: session?.user?.name,
    id: session?.id,
  };

  const { targetUsername } = context.query;
  if (!targetUsername) {
    return {
      props: {
        userData,
      },
    }
  }

  const httpProtocol = getHttpProtocol(context.req.headers.host as string);
  const url = `${httpProtocol}://${context.req.headers.host}/api/twitter/${session?.id}/mutuals/${targetUsername}`;
  const { targetData } = await fetch(url, {
    headers: {
      'access-token': session?.access_token as string,
    },
  }).then((response) => {
    return response?.json();
  })
    .catch((error) => {
      console.log({ er: error });
      return {
        props: {
          userData,
        },
      }
    });

  return {
    props: {
      userData,
      targetData,
    }
  }
}

