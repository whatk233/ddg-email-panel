import type { GetStaticProps, NextPage } from 'next'
import type { UserInfo } from '../types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { atom, useAtom } from 'jotai'
import { DocumentDuplicateIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { CgSpinner } from 'react-icons/cg'
import Layout from '../components/Layout/Layout'
import * as store from '../utils/store'
import generateAddresses from '../utils/generateAddresses'

const userIdAtom = atom<number | null>(null)
const userInfoAtom = atom<UserInfo | null>(null)
const loadingAtom = atom<boolean>(true)

const Loading = () => {
  return (
    <Layout
      title={`Loading`}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      <CgSpinner className="w-8 h-8 text-slate-500 animate-spin" />
    </Layout>
  )
}

const CopyBtn = ({ text, disabled = false }: { text: string; disabled?: boolean }) => {
  const { t } = useTranslation('')
  const [status, setStatus] = useState<boolean>(true)
  return (
    <button
      className="flex items-center justify-center h-8 px-2 py-1 text-sm text-white rounded-md shadow dark:text-slate-300 bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-400 hover:disabled:bg-slate-400 dark:hover:disabled:bg-slate-400 disabled:cursor-not-allowed"
      disabled={!status || disabled}
      onClick={() => {
        setStatus(false)
        navigator.clipboard.writeText(text)
        setTimeout(() => {
          setStatus(true)
        }, 2000)
      }}
    >
      <DocumentDuplicateIcon className="w-4 mr-1" />
      {status ? t('Copy') : t('Copied')}
    </button>
  )
}

const Email = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [generateBtnStatus, setGenerateBtnStatus] = useState<boolean>(false)
  const { t } = useTranslation('')
  const generateAddressesHandle = () => {
    setGenerateBtnStatus(true)
    generateAddresses(userInfo?.access_token || '')
      .then((res) => {
        const result = store.editAccount(0, { nextAlias: res.address })
        setUserInfo(result)
      })
      .catch((res) => {
        if (res?.status) {
          if (res?.status == 401) {
            toast.error(`${t('Generate failed')} - ${t('Unauthorized.1')}`)
          } else {
            toast.error(`${t('Generate failed')} - (${res.status} - ${res.statusText})`)
          }
        } else {
          toast(`${t('Error')} - ${res.message}`)
        }
      })
      .finally(() => {
        setGenerateBtnStatus(false)
      })
  }

  if (userInfo) {
    return (
      <Layout
        title={t('myemail')}
        className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center max-w-xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <p className="font-medium">{t('Main Duck Address')}</p>
            <div className="flex justify-between">
              <p className="text-xl">{`${userInfo.username}@duck.com`}</p>
              <CopyBtn text={`${userInfo.username}@duck.com`} />
            </div>
          </div>
          <div className="w-full">
            <p className="font-medium">{t('Private Duck Address')}</p>
            <div className="flex justify-between">
              {userInfo?.nextAlias == '' ? (
                <div className="w-48 h-3 max-w-sm my-3 mb-4 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
              ) : (
                <p className="text-xl">{`${userInfo?.nextAlias}@duck.com`}</p>
              )}
              <CopyBtn
                disabled={userInfo?.nextAlias == ''}
                text={`${userInfo.nextAlias}@duck.com`}
              />
            </div>
          </div>
          <button
            className={`flex items-center justify-center bg-sky-600 hover:bg-sky-500 dark:text-slate-300 dark:bg-sky-700 dark:hover:bg-sky-600 shadow rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 hover:disabled:bg-slate-400 disabled:cursor-not-allowed`}
            disabled={generateBtnStatus}
            onClick={() => {
              generateAddressesHandle()
            }}
          >
            {generateBtnStatus ? (
              <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <SparklesIcon className="w-5 h-5 mr-2" />
            )}
            {t('Generate Private Duck Address')}
          </button>
          <div className="m-0 alert-success">
            {t('For untrusted websites, Privacy Duck Addresses can hide your email identity')}
          </div>
          <div className="m-0 text-sm alert-warn">{t('DDG Email Panel respects your privacy')}</div>
        </div>
      </Layout>
    )
  }
  return (
    <Layout
      title={t('Error')}
      className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
    >
      {t('Some Error')}
    </Layout>
  )
}

const EmailPage: NextPage = () => {
  const router = useRouter()
  const [, setUserId] = useAtom(userIdAtom)
  const [, setuserInfo] = useAtom(userInfoAtom)
  const [loading, setLoading] = useAtom(loadingAtom)

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
      setUserId(Number(id))
      setuserInfo(userInfo)
      setLoading(false)
      localStorage.lastuser = id
    } else if (Number(id) !== 0 && store.getAccount(0)) {
      router.push({
        query: { id: 0 },
      })
    } else {
      router.push('/login')
    }
  }, [router, setLoading, setuserInfo, setUserId])

  if (loading) {
    return <Loading />
  }
  return <Email />
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default EmailPage
