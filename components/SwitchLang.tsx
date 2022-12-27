import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react'
import { FaLanguage } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { setCookie } from 'cookies-next'

const SwitchBtn = ({ text, href, locale }: { text: string; href: string; locale: string }) => {
  return (
    <Link href={href} locale={locale}>
      <MenuItem
        onClick={() => {
          setCookie('NEXT_LOCALE', locale)
        }}
      >
        {text}
      </MenuItem>
    </Link>
  )
}

export default function SwitchLang({ ...prop }) {
  const router = useRouter()
  return (
    <Menu {...prop}>
      <MenuButton
        as={IconButton}
        icon={<FaLanguage />}
        colorScheme="gray"
        aria-label="SwitchLang"
      />
      <MenuList>
        <SwitchBtn text="English" href={router.asPath} locale="en" />
        <SwitchBtn text="简体中文" href={router.asPath} locale="zh-CN" />
        <SwitchBtn text="日本語" href={router.asPath} locale="ja-JP" />
      </MenuList>
    </Menu>
  )
}
