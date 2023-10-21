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
  const { t } = useTranslation('')
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
      <div className="relative flex flex-row h-screen overflow-hidden dark:bg-slate-900 dark:text-slate-300">
        {/* nav */}
        <Nav />
        <main className="w-full overflow-auto">
          <div className="flex items-center w-full px-4 bg-white dark:bg-slate-900 h-14">
            <NavSwitch />
            <div className="ml-2 lg:hidden">DDG Email Panel</div>
          </div>
          <div className={`px-8 py-4 ${className ? className : ''}`}>{children}</div>
        </main>
      </div>
      <Toaster
        toastOptions={{
          className:
            'dark:bg-slate-800 dark:text-slate-300 dark:border-2 dark:border-slate-700 dark:shadow-xl',
        }}
      />
    </>
  )
}
