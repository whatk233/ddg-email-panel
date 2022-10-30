import type { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'

const EmailPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('common')

  useEffect(() => {
    const { id } = router.query
    // If user id query is empty, get the last user id
    if (!id && localStorage.lastuser) {
      router.push({
        query: {
          id: Number(localStorage.lastuser),
        },
      })
    }
    const userInfo = store.getAccount(Number(id))
    if (userInfo) {
      //
    } else if (Number(id) !== 0 && store.getAccount(0)) {
      router.push({
        query: { id: 0 },
      })
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <Layout
      title={t('nav.account')}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      Coming soon...
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default EmailPage
