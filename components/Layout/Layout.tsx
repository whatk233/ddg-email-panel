import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import Nav, { NavSwitch } from './Nav'

export default function Layout({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string | undefined
  title: string
}) {
  const { t } = useTranslation('common')
  return (
    <>
      <Head>
        <title>{title ? `${title} - DDG Email Panel` : 'DDG Email Panel'}</title>
        <meta
          property="og:title"
          content={title ? `${title} - DDG Email Panel` : 'DDG Email Panel'}
        />
        <meta property="og:description" content={t('DDG Email Introduction')} />
        <meta name="description" content={t('DDG Email Introduction')} />
      </Head>
      <div className="flex relative flex-row overflow-hidden h-screen">
        {/* nav */}
        <Nav />
        <main className="overflow-auto w-full">
          <div className="flex items-center px-4 bg-white h-14 w-full">
            <NavSwitch />
            <div className="lg:hidden ml-2">DDG Email Panel</div>
          </div>
          <div className={`px-8 py-4 ${className ? className : ''}`}>{children}</div>
        </main>
      </div>
      <Toaster />
    </>
  )
}
