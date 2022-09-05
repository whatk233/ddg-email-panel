import type { GetStaticProps, NextPage } from 'next'
import type { UserInfo } from '../types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, VStack, Text, Flex, Button, Spinner, Skeleton, useToast } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { atom, useAtom } from 'jotai'
import CenterBox from '../components/Layout/CenterBox'
import * as store from '../utils/store'
import generateAddresses from '../utils/generateAddresses'

const userIdAtom = atom<number | null>(null)
const userInfoAtom = atom<UserInfo | null>(null)
const loadingAtom = atom<boolean>(true)

const Loading = () => {
  const { t } = useTranslation('common')
  return (
    <CenterBox title={t('loading')}>
      <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="blue.600" size="xl" />
    </CenterBox>
  )
}

const CopyBtn = ({ text }: { text: string }) => {
  const { t } = useTranslation('email')
  const [status, setStatus] = useState<boolean>(true)
  return (
    <Button
      size="sm"
      disabled={!status}
      onClick={() => {
        setStatus(false)
        navigator.clipboard.writeText(text)
        setTimeout(() => {
          setStatus(true)
        }, 2000)
      }}
    >
      {status ? t('Copy') : t('Copied')}
    </Button>
  )
}

const Email = () => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [generateBtnStatus, setGenerateBtnStatus] = useState<boolean>(false)
  const { t } = useTranslation('email')
  const tcommon = useTranslation('common')
  const toast = useToast()
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
            toast({
              title: t('email.Generate failed'),
              description: t('Unauthorized'),
              status: 'error',
              isClosable: true,
            })
          } else {
            toast({
              title: t('Generate Error'),
              description: `${res.status} - ${res.statusText}`,
              status: 'error',
              isClosable: true,
            })
          }
        } else {
          toast({
            title: t('Error'),
            description: res.message,
            status: 'error',
            isClosable: true,
          })
        }
      })
      .finally(() => {
        setGenerateBtnStatus(false)
      })
  }

  const signOutHandle = () => {
    store.clear()
    router.reload()
  }

  if (userInfo) {
    return (
      <CenterBox title={tcommon.t('myemail')}>
        <VStack w="100%" spacing={6}>
          <Box w="100%">
            <Text fontWeight="medium">{t('Main Duck Address')}</Text>
            <Flex justifyContent="space-between">
              <Text fontSize="xl">{`${userInfo.username}@duck.com`}</Text>
              <CopyBtn text={`${userInfo.username}@duck.com`} />
            </Flex>
          </Box>
          <Box w="100%">
            <Text fontWeight="medium">{t('Private Duck Address')}</Text>
            <Flex justifyContent="space-between">
              <Skeleton height="1.25rem" my="6px" isLoaded={userInfo?.nextAlias !== ''}>
                <Text fontSize="xl">{`${userInfo?.nextAlias}@duck.com`}</Text>
              </Skeleton>
              <CopyBtn text={`${userInfo.nextAlias}@duck.com`} />
            </Flex>
          </Box>
          <Button
            onClick={() => {
              generateAddressesHandle()
            }}
            colorScheme="blue"
            size="md"
            width="100%"
            isLoading={generateBtnStatus}
          >
            {t('Generate Private Duck Address')}
          </Button>
          <Text fontSize="sm" color="blackAlpha.700">
            {t('For untrusted websites, Privacy Duck Addresses can hide your email identity')}
          </Text>
          <Button
            onClick={() => {
              signOutHandle()
            }}
            colorScheme="red"
            variant="link"
          >
            {t('Sign Out')}
          </Button>
        </VStack>
      </CenterBox>
    )
  }
  return <CenterBox>{t('Some Error')}</CenterBox>
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
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'email'])),
    },
  }
}

export default EmailPage
