import type { GetStaticProps, NextPage } from 'next'
import React from 'react'
import { atom, useAtom } from 'jotai'
import {
  VStack,
  Heading,
  InputGroup,
  Input,
  InputRightAddon,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CenterBox from '../components/Layout/CenterBox'
import { USERNAME_REGEX } from '../lib/constants'
import fetch from '../utils/fetch'
import * as store from '../utils/store'
import maskEmail from '../utils/maskEmail'
import generateAddresses from '../utils/generateAddresses'

const usernameAtom = atom<string>('')
const otpAtom = atom<string>('')
const loadingAtom = atom<boolean>(false)
const stepAtom = atom<'EnterUsername' | 'EnterOtp'>('EnterUsername')

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
  const { t } = useTranslation('login')
  const toast = useToast()
  const [username, setUsername] = useAtom(usernameAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)

  const usernameHandleChange = (event: { target: { value: string } }) =>
    setUsername(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (username == '') {
      toast({
        description: t('Duck Address cannot be empty'),
        status: 'error',
        isClosable: true,
      })
      return
    }
    if (!USERNAME_REGEX.test(username)) {
      toast({
        description: t('Duck Address can only contain letters and numbers'),
        status: 'error',
        isClosable: true,
      })
      return
    }
    setLoading(true)
    otpRequest(username)
      .then(() => {
        setStep('EnterOtp')
      })
      .catch((res) => {
        console.log('send login link error', res)
        if (res?.status) {
          toast({
            title: 'Error',
            description: `${res.status} - ${res.statusText}`,
            status: 'error',
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: res.message,
            status: 'error',
            isClosable: true,
          })
        }
        return
      })
      .finally(() => setLoading(false))
  }
  return (
    <form onSubmit={continueHandle}>
      <VStack spacing={6}>
        <Heading as="h4" size="md">
          {t('Enter your Duck Address')}
        </Heading>
        <InputGroup size="lg">
          <Input
            type="text"
            value={username}
            onChange={usernameHandleChange}
            placeholder={t('Duck Address')}
          />
          <InputRightAddon>@duck.com</InputRightAddon>
        </InputGroup>
        <Button type="submit" isLoading={loading} colorScheme="blue" size="md" width="100%">
          {t('Continue')}
        </Button>
        <Link href="https://duckduckgo.com/email/start" target="_blank" passHref>
          <a target="_blank" rel="noopener noreferrer">
            <Button variant="link">{t('No Duck Address')}</Button>
          </a>
        </Link>
      </VStack>
    </form>
  )
}

const EnterOtp = () => {
  const { t } = useTranslation('login')
  const [username] = useAtom(usernameAtom)
  const [otp, setOtp] = useAtom(otpAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setStep] = useAtom(stepAtom)
  const toast = useToast()
  const router = useRouter()

  const otpHandleChange = (event: { target: { value: string } }) => setOtp(event.target.value)
  const continueHandle = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (otp == '') {
      toast({
        description: t('One-time Passphrase cannot be empty'),
        status: 'error',
        isClosable: true,
      })
      return
    }
    setLoading(true)
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
      })
      .catch((res) => {
        console.log('login error', res)
        if (res?.status) {
          if (res?.status == 401) {
            toast({
              title: t('Login failed'),
              description: t('Unauthorized'),
              status: 'error',
              isClosable: true,
            })
          } else {
            toast({
              title: 'Error',
              description: `${res.status} - ${res.statusText}`,
              status: 'error',
              isClosable: true,
            })
          }
        } else {
          toast({
            title: 'Error',
            description: res.message,
            status: 'error',
            isClosable: true,
          })
        }
        return
      })
      .finally(() => setLoading(false))
  }
  return (
    <form onSubmit={continueHandle}>
      <VStack spacing={6}>
        <Heading as="h4" size="md">
          {t('Check your inbox')}
        </Heading>
        <Text textAlign="center">
          {t(
            'DuckDuckGo One-time Passphrase has been sent to your email address, please enter it below and continue'
          )}
        </Text>
        <Input
          type="text"
          value={otp}
          onChange={otpHandleChange}
          placeholder={t('Enter your one-time passphrase')}
          size="lg"
        />
        <Button type="submit" isLoading={loading} colorScheme="blue" size="md" width="100%">
          {t('Continue')}
        </Button>
        <Button
          variant="link"
          onClick={() => {
            setOtp('')
            setStep('EnterUsername')
          }}
        >
          {t('Back')}
        </Button>
      </VStack>
    </form>
  )
}

const LoginPage: NextPage = () => {
  const [step] = useAtom(stepAtom)
  if (step == 'EnterUsername') {
    return (
      <CenterBox>
        <EnterUsername />
      </CenterBox>
    )
  }
  if (step == 'EnterOtp') {
    return (
      <CenterBox>
        <EnterOtp />
      </CenterBox>
    )
  }
  return <>loading...</>
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'login'])),
    },
  }
}

export default LoginPage
