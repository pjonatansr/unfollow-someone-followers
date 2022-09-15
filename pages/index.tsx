import type { GetServerSideProps, NextPage } from 'next'
import { HomeWithoutAuth } from '../components/HomeWithoutAuth'
import { getSession } from 'next-auth/react';


const HomePage: NextPage = () => {

  return <HomeWithoutAuth />

}

export default HomePage


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return {
    props: {}
  }

  if (!!session.expires) {
    const now = new Date()
    const expires = new Date(session.expires)
    if (now > expires) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  }


  return {
    redirect: {
      permanent: false,
      destination: `/unfollow`
    },
  }
};
