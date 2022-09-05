import type { GetServerSideProps, NextPage } from 'next'

const Home: NextPage = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      permanent: false,
      destination: `/${ctx.locale}/email`,
    },
  }
}

export default Home
