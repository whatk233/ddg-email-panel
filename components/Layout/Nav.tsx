import { Fragment, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { Dialog, Transition } from '@headlessui/react'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import Logo from '../../public/logo.svg'
import {
  LanguageIcon,
  MoonIcon,
  AtSymbolIcon,
  UserIcon,
  Bars3Icon,
  CogIcon,
  SunIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { FiGithub } from 'react-icons/fi'

const isOpenAtom = atom<boolean>(false)
const uidAtom = atom<number>(0)

type NavItem = {
  icon: JSX.Element
  title: string
  href?: string
  router?: string
}

type BottomNavItem = {
  icon: JSX.Element
  title: string
  href?: string
  locale?: string
  handle?: () => void
}

const notLoginNavItem: NavItem[] = [
  {
    title: 'Github',
    icon: <FiGithub className="w-5" />,
    href: 'https://github.com/whatk233/ddg-email-panel',
  },
]

const navItem: NavItem[] = [
  {
    title: 'nav.address',
    icon: <AtSymbolIcon />,
    href: '#',
    router: '/email',
  },
  {
    title: 'nav.account',
    icon: <UserIcon />,
    href: '#',
    router: '/account',
  },
  {
    title: 'Github',
    icon: <FiGithub className="w-5" />,
    href: 'https://github.com/whatk233/ddg-email-panel',
  },
]

const themeSwitchItems: BottomNavItem[] = [
  {
    icon: <CogIcon />,
    title: 'nav.themeItems.system',
    handle: () => {
      localStorage.removeItem('theme')
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
  },
  {
    icon: <SunIcon />,
    title: 'nav.themeItems.light',
    handle: () => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    },
  },
  {
    icon: <MoonIcon />,
    title: 'nav.themeItems.dark',
    handle: () => {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    },
  },
]

const languageSwitchItems: BottomNavItem[] = [
  {
    icon: <GlobeAltIcon />,
    title: 'English',
    locale: 'en',
    handle: () => {
      setCookie('NEXT_LOCALE', 'en')
    },
  },
  {
    icon: <GlobeAltIcon />,
    title: '简体中文',
    locale: 'zh-CN',
    handle: () => {
      setCookie('NEXT_LOCALE', 'zh-CN')
    },
  },
  {
    icon: <GlobeAltIcon />,
    title: '日本語',
    locale: 'ja-JP',
    handle: () => {
      setCookie('NEXT_LOCALE', 'ja-JP')
    },
  },
]

const NavLink = ({
  icon,
  title = 'Link',
  href = '#',
  router,
}: {
  icon: JSX.Element
  title: string
  href?: string
  router?: string
}) => {
  const [uid] = useAtom(uidAtom)
  const { t } = useTranslation('')
  const uRouter = useRouter()
  const classNames = `flex items-center p-2 rounded-md group hover:bg-slate-200 dark:hover:bg-slate-700`
  if (router) {
    return (
      <button
        type="button"
        className={classNames}
        onClick={() => {
          if (router) {
            uRouter.push(`${router}`, {
              query: { id: uid },
            })
          }
        }}
      >
        <span className="w-5">{icon}</span>
        <span className="pl-3">{t(title)}</span>
      </button>
    )
  } else {
    return (
      <Link
        className={classNames}
        href={href}
        target={href.includes('https://') ? '_blank' : ''}
        rel="noopener noreferrer"
      >
        <span className="w-5">{icon}</span>
        <span className="pl-3">{t(title)}</span>
      </Link>
    )
  }
}

function BottomMenu({
  title,
  icon,
  children,
}: {
  title: string
  icon: JSX.Element
  children: React.ReactNode
}) {
  return (
    <Menu>
      <Menu.Button
        type="button"
        className="flex items-center w-full p-2 rounded-md group hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <span className="w-5">{icon}</span>
        <span className="pl-3">{title}</span>
      </Menu.Button>
      <Menu.Items className="absolute top-0 w-full h-full overflow-y-auto bg-slate-100 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full dark:bg-slate-800">
        {children}
      </Menu.Items>
    </Menu>
  )
}

function BottomMenuItem({ icon, title, href, locale, handle }: BottomNavItem) {
  const { t } = useTranslation('')
  const classNames = `w-full group flex items-center rounded-md p-2 dark:hover:bg-slate-700`
  const activeClassNames = `bg-slate-200 dark:hover:bg-slate-700`
  const attrs = {} as {
    locale: string
    onClick: () => void
  }
  if (locale) {
    attrs.locale = locale
  }
  if (handle) {
    attrs.onClick = handle
  }
  if (href) {
    return (
      <Menu.Item>
        {({ active }) => (
          <Link className={`${classNames} ${active && activeClassNames}`} href={href} {...attrs}>
            <span className="w-5">{icon}</span>
            <span className="pl-3">{t(title)}</span>
          </Link>
        )}
      </Menu.Item>
    )
  }
  return (
    <Menu.Item>
      {({ active }) => (
        <button className={`${classNames} ${active && activeClassNames}`} {...attrs}>
          <span className="w-5">{icon}</span>
          <span className="pl-3">{t(title)}</span>
        </button>
      )}
    </Menu.Item>
  )
}

export function NavSwitch() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  return (
    <button
      onClick={() => {
        setIsOpen(!isOpen)
      }}
      className="w-8 p-1 rounded lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <Bars3Icon className="fill-slate-700" />
    </button>
  )
}

function NavMain() {
  const uRouter = useRouter()
  const { t } = useTranslation('')
  return (
    <>
      <div className="flex items-center justify-center pb-8">
        <Image src={Logo} alt="Logo" className="w-12" />
        <span className="ml-4 text-lg">DDG Email Panel</span>
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh_-_232px)] md:h-[calc(100vh_-_132px)]">
        <div className="grid items-start gap-1">
          {uRouter.route == '/login'
            ? notLoginNavItem.map((item, index) => <NavLink key={index} {...item} />)
            : navItem.map((item, index) => <NavLink key={index} {...item} />)}
        </div>
        <div className="relative">
          <BottomMenu title={t('nav.theme')} icon={<MoonIcon />}>
            {themeSwitchItems.map((item, index) => (
              <BottomMenuItem key={index} {...item} />
            ))}
          </BottomMenu>
          <BottomMenu title="Language" icon={<LanguageIcon />}>
            {languageSwitchItems.map((item, index) => (
              <BottomMenuItem key={index} href={uRouter.asPath} {...item} />
            ))}
          </BottomMenu>
          {process.env.NEXT_PUBLIC_GIT_LASTCOMMIT_SHORTHASH && (
            <BottomMenu
              title={t(`nav.version`, {
                shorthash: process.env.NEXT_PUBLIC_GIT_LASTCOMMIT_SHORTHASH,
              })}
              icon={<InformationCircleIcon />}
            >
              <div className="flex flex-col">
                <span className="mb-2 font-bold">Info</span>
                <span className="text-sm">
                  <span className="block font-bold">Committed Date</span>
                  <span className="block">
                    {process.env.NEXT_PUBLIC_GIT_LASTCOMMIT_DATE || ''}
                  </span>
                </span>
              </div>
            </BottomMenu>
          )}
        </div>
      </div>
    </>
  )
}

export default function Nav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const [userId, setUserId] = useAtom(uidAtom)
  useEffect(() => {
    const { id } = router.query
    setUserId(Number(id))
  }, [router.query, setUserId, userId])
  return (
    <>
      {/* Mobile */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`fixed inset-0 flex lg:hidden`}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/25 dark:bg-black/60"
              onClick={() => setIsOpen(false)}
            />
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <aside className="z-10 w-64 min-h-screen p-5 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
              <NavMain />
            </aside>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* PC */}
      <aside
        className={`hidden lg:block min-h-screen overflow-hidden shrink-0 w-64 p-5 bg-slate-100 dark:bg-slate-800 dark:text-slate-300`}
      >
        <NavMain />
      </aside>
    </>
  )
}
