import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component,
  pageProps: {
    session,
    ...pageProps
  },
}: any) {

  return (
    <ChakraProvider>
      <SessionProvider
        refetchInterval={20 * 60}
        session={session}
      >
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
