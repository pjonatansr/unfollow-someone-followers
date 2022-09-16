import type { GetServerSideProps, NextPage } from 'next'
import { HomeWithoutAuth } from '../components/HomeWithoutAuth'
import { getSession } from 'next-auth/react';

const HomePage: NextPage = () => <HomeWithoutAuth />

export default HomePage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      props: {}
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: `/unfollow`,
    },
  }
};
