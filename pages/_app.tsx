import { ChakraProvider, HStack } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { TwitterLogin } from '../components/TwitterLogin'

function MyApp({ Component,
  pageProps: {
    session,
    ...pageProps },
}: any) {

  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <HStack
          gap={10}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <TwitterLogin></TwitterLogin>
        </HStack>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
