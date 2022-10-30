import { Fragment, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import DdgLogo from '../../public/dax-logo.svg'
import {
  LanguageIcon,
  MoonIcon,
  AtSymbolIcon,
  UserIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { FiGithub } from 'react-icons/fi'
import { useRouter } from 'next/router'

const isOpenAtom = atom<boolean>(false)
const uidAtom = atom<number>(0)

type NavItem = {
  icon: JSX.Element
  title: string
  href?: string
  router?: string
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
  const { t } = useTranslation('common')
  const uRouter = useRouter()
  if (router) {
    return (
      <button
        type="button"
        className="group flex items-center hover:bg-slate-200 rounded-md p-2"
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
        className="group flex items-center hover:bg-slate-200 rounded-md p-2"
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

export function NavSwitch() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  return (
    <button
      onClick={() => {
        setIsOpen(!isOpen)
      }}
      className="lg:hidden w-8 hover:bg-slate-100 rounded p-1"
    >
      <Bars3Icon className="fill-slate-700" />
    </button>
  )
}

function NavMain() {
  const uRouter = useRouter()
  const { t } = useTranslation('common')
  return (
    <>
      <div className="flex items-center justify-center pb-8">
        <Image src={DdgLogo} alt="Logo" className="w-12" />
        <span className="ml-4 text-xl">DDG Email Panel</span>
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh_-_132px)]">
        <div className="grid items-start gap-1">
          {uRouter.route == '/login'
            ? notLoginNavItem.map((item, index) => (
              <NavLink
                key={index}
                title={item.title}
                href={item.href}
                icon={item.icon}
                router={item.router}
              />
            ))
            : navItem.map((item, index) => (
              <NavLink
                key={index}
                title={item.title}
                href={item.href}
                icon={item.icon}
                router={item.router}
              />
            ))}
        </div>
        <div>
          <NavLink title={t('nav.theme')} href="#" icon={<MoonIcon />} />
          <NavLink title="Language" href="#" icon={<LanguageIcon />} />
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
            <div className="fixed inset-0 bg-black/25" onClick={() => setIsOpen(false)} />
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <aside className="min-h-screen overflow-hidden shrink-0 w-64 p-5 bg-slate-100 z-10">
              <NavMain />
            </aside>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* PC */}
      <aside
        className={`hidden lg:block min-h-screen overflow-hidden shrink-0 w-64 p-5 bg-slate-100`}
      >
        <NavMain />
      </aside>
    </>
  )
}
