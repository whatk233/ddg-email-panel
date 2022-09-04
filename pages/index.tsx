import type { GetStaticProps, NextPage } from 'next'

const Home: NextPage = () => {
  return <></>
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    redirect: {
      permanent: false,
      destination: `/${ctx.locale}/email`,
    },
  }
}

export default Home
