import { VStack, Heading, Image, Text, Box } from "@chakra-ui/react"
import { SessionProvider, signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
import { TwitterLogin } from "./TwitterLogin"

export const HomeWithoutAuth = (): JSX.Element => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn('twitter');
    }
  }, [session]);

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
    <Box>
      <SessionProvider>
        <TwitterLogin />
      </SessionProvider>
    </Box>
  </VStack>
}