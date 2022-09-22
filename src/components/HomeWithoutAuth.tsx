import { VStack, Heading, Image, Text, Spinner, HStack } from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
import { TwitterLogin } from "./TwitterLogin"

export const HomeWithoutAuth = (): JSX.Element => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn('twitter');
    }
  }, [session]);

  if (session?.error) {
    return (
      <VStack>
        <Spinner size='xl' />
      </VStack>
    );
  }

  return <VStack
    flexDirection={'column'}
    textAlign={'center'}
    justifyContent={'space-between'}
    p={10}
    gap={5}
    h={'80vh'}
  >
    <Heading>
      <Image
        src={'./logo.png'}
        alt="logo" />
    </Heading>
    <Text>
      We don&apos; t need them. Take the first step to unfollow who we don&apos;t want to support.
    </Text>
    <HStack
      gap={10}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <TwitterLogin />
    </HStack>
  </VStack>
}