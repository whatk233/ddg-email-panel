import type { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'

const EmailPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('')

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
      <button
        className={`flex items-center justify-center bg-red-600 hover:bg-red-500 dark:text-slate-300 dark:bg-red-700 dark:hover:bg-red-600 shadow rounded-md px-4 py-2 my-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-slate-400 hover:disabled:bg-slate-400 disabled:cursor-not-allowed`}
        onClick={() => {
          store.clear()
          router.reload()
        }}
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
        Log Out
      </button>
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
