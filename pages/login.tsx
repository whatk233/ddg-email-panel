import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/solid'
import { CgSpinner } from 'react-icons/cg'
import Layout from '../components/Layout/Layout'
import { USERNAME_REGEX } from '../lib/constants'
import fetch from '../utils/fetch'
import generateAddresses from '../utils/generateAddresses'
import * as store from '../utils/store'
import maskEmail from '../utils/maskEmail'

const usernameAtom = atom<string>('')
const otpAtom = atom<string>('')
const loadingAtom = atom<boolean>(false)
const stepAtom = atom<'EnterUsername' | 'EnterOtp'>('EnterUsername')
const loginMethodAtom = atom<'username' | 'token'>('username')

const otpRequest = (username: string) => {
  return fetch(`/api/auth/loginlink`, {
    method: 'POST',
    body: JSON.stringify({
      username,
    }),
  })
}

const loginRequest = (username: string, otp: string) => {
  return fetch(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      otp,
    }),
  })
}

const EnterUsername = () => {
  const { t } = useTranslation('')
  const [username, setUsername] = useAtom(usernameAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)
  const [, setLoginMethod] = useAtom(loginMethodAtom)

  const usernameHandleChange = (event: { target: { value: string } }) =>
    setUsername(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (username == '') {
      toast.error(t('Duck Address cannot be empty'))
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      toast.error(t('Duck Address can only contain letters and numbers'))
      return
    }
    setLoading(true)
    otpRequest(username)
      .then(() => {
        setLoginMethod('username')
        setStep('EnterOtp')
      })
      .catch((res) => {
        console.log('send login link error', res)
        if (res?.status) {
          toast.error(`${res.status} - ${res.statusText}`)
        } else {
          toast.error(`${res.message}`)
        }
        return
      })
      .finally(() => setLoading(false))
  }
  const continueUseTokenHandle = () => {
    if (username == '') {
      toast.error(t('Duck Address cannot be empty'))
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      toast.error(t('Duck Address can only contain letters and numbers'))
      return
    }
    setLoginMethod('token')
    setStep('EnterOtp')
  }
  return (
    <>
      <div className="text-center">
        <h4>{t('Enter your Duck Address')}</h4>
        <p className="text-gray-500">{t('login tip')}</p>
      </div>
      <form onSubmit={continueHandle}>
        <div className="flex flex-col items-center rounded-lg w-full md:w-[500px] md:p-10 p-5">
          {/* input */}
          <div className="relative w-full my-8 mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={username}
              onChange={usernameHandleChange}
              placeholder={t('Duck Address')}
              className="block w-full rounded-md border-gray-300 pl-10 pr-[98px] focus:border-slate-500 focus:ring-slate-500 sm:text-sm dark:border-gray-500 dark:bg-gray-900 dark:text-slate-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <span className="inline-flex items-center h-full px-3 text-gray-500 border border-gray-300 dark:border-gray-500 rounded-r-md bg-gray-50 dark:bg-gray-800 dark:text-slate-400 sm:text-sm">
                @duck.com
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y-2 w-full">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-2 text-white rounded-md shadow dark:text-slate-300 bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-400 hover:disabled:bg-slate-400 dark:hover:disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('login')
              )}
            </button>
            <a
              onClick={() => {
                continueUseTokenHandle()
              }}
              className="flex items-center justify-center w-full px-4 py-2 text-sky-600 hover:underline underline-offset-2 dark:text-slate-300 cursor-pointer"
            >
              {t('Login using Access Token')}
            </a>
          </div>
          <Link
            href="https://duckduckgo.com/email/start"
            className="mt-3 text-gray-600 hover:underline underline-offset-2 hover:text-sky-500 dark:text-gray-500"
            target="_blank"
            passHref
            rel="noopener noreferrer"
          >
            {t('No Duck Address')}
          </Link>
        </div>
      </form>
    </>
  )
}

const EnterOtp = () => {
  const { t } = useTranslation('')
  const [username] = useAtom(usernameAtom)
  const [otp, setOtp] = useAtom(otpAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)
  const [loginMethod] = useAtom(loginMethodAtom)
  const router = useRouter()

  const otpHandleChange = (event: { target: { value: string } }) => setOtp(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (otp == '') {
      toast.error(t('One-time Passphrase cannot be empty'))
      return
    }
    setLoading(true)
    // using token
    if (loginMethod === 'token') {
      const user = {
        access_token: otp,
        cohort: '',
        email: '',
        username,
      }
      // generate alias
      generateAddresses(user.access_token)
        .then((res) => {
          const userIndex = store.addAccount({
            ...user,
            remark: maskEmail(user.email),
            nextAlias: res.address,
          })
          // redirect
          router.push(`/email/?id=${userIndex}`)
          toast.success(t('Login Success'))
        })
        .catch((res) => {
          console.log('generate alias error', res)
          toast.error(t('The access token cannot generate an alias'))
          setLoading(false)
          return
        })
      return
    }
    loginRequest(username, otp.trim())
      .then((res) => {
        const { user } = res as {
          user: {
            access_token: string
            cohort: string
            email: string
            username: string
          }
        }
        // generate alias
        generateAddresses(user.access_token)
          .then((res) => {
            const userIndex = store.addAccount({
              ...user,
              remark: maskEmail(user.email),
              nextAlias: res.address,
            })
            // redirect
            router.push(`/email/?id=${userIndex}`)
          })
          .catch((res) => {
            console.log('generate alias error', res)
            const userIndex = store.addAccount({
              ...user,
              remark: maskEmail(user.email),
              nextAlias: '',
            })
            // redirect
            router.push(`/email/?id=${userIndex}`)
            return
          })
          .finally(() => {
            toast.success(t('Login Success'))
          })
      })
      .catch((res) => {
        console.log('login error', res)
        if (res?.status) {
          if (res?.status == 401) {
            toast.error(t('Unauthorized'))
          } else {
            toast.error(`${res.status} - ${res.statusText}`)
          }
        } else {
          toast.error(res.message)
        }
        return
      })
      .finally(() => setLoading(false))
  }
  return (
    <>
      <div className="text-center">
        <h4>{loginMethod === 'username' ? t('Check your inbox') : t('Enter your Access Token')}</h4>
        <p className="text-gray-500">
          {loginMethod === 'username' ? (
            t(
              'DuckDuckGo One-time Passphrase has been sent to your email address, please enter it below and continue'
            )
          ) : (
            <Link
              className="mt-2 underline underline-offset-2 hover:text-sky-500"
              href="https://bitwarden.com/help/generator/#tab-duckduckgo-3Uj911RtQsJD9OAhUuoKrz"
              target="_blank"
            >
              {t('How to obtain a Token')}
            </Link>
          )}
        </p>
      </div>
      <form onSubmit={continueHandle}>
        <div className="flex flex-col items-center rounded-lg w-full md:w-8/12 lg:w-[500px] md:p-10 p-5">
          {/* input */}
          <div className="relative w-full my-8 mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <KeyIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              className="block w-full rounded-md border-gray-300 pl-10 pr-10 focus:border-slate-500 focus:ring-slate-500 sm:text-sm dark:border-gray-500 dark:bg-gray-900 dark:text-slate-400"
              type="text"
              value={otp}
              onChange={otpHandleChange}
              placeholder={
                loginMethod === 'username'
                  ? t('Enter your one-time passphrase')
                  : t('Enter your Access Token')
              }
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-2 text-white rounded-md shadow dark:text-slate-300 bg-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 disabled:bg-slate-400 dark:disabled:bg-slate-400 hover:disabled:bg-slate-400 dark:hover:disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('Continue')
            )}
          </button>
          <button
            className="mt-3 text-gray-600 hover:underline underline-offset-2 hover:text-sky-500"
            onClick={() => {
              setOtp('')
              setStep('EnterUsername')
            }}
          >
            {t('Back')}
          </button>
        </div>
      </form>
    </>
  )
}

const LoginPage: NextPage = () => {
  const [step] = useAtom(stepAtom)
  const { t } = useTranslation('')
  if (step) {
    return (
      <Layout
        title={t('login')}
        className="flex flex-col h-[calc(100vh_-_120px)] items-center justify-center"
      >
        {step == 'EnterUsername' ? <EnterUsername /> : <EnterOtp />}
        <div className="mt-10 text-sm alert-warn lg:mx-24">
          {t('DDG Email Panel respects your privacy')}
        </div>
      </Layout>
    )
  }
  return <>loading...</>
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
    },
  }
}

export default LoginPage
