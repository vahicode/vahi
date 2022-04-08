import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from 'components/logos/vahi.js'
import Right from 'components/icons/right.js'
import Left from 'components/icons/left.js'
import Header from 'components/header'
import Footer from 'components/footer'

const Breadcrumbs = ({ app, crumbs = [], title = 'VaHI' }) => {
  return (
    <ul className="flex flex-row flex-wrap items-center gap-2 font-bold">
      <li>
        <Link href="/">
          <a title="VaHI" className="text-link">
            VaHI
          </a>
        </Link>
      </li>
      {crumbs.map((crumb) => (
        <React.Fragment key={crumb[1]}>
          <li className="text-base-content">&raquo;</li>
          <li>
            {crumb[2] ? (
              <Link href={crumb[1]}>
                <a title={crumb[0]} className="text-secondary hover:text-secondary-focus">
                  {crumb[0]}
                </a>
              </Link>
            ) : (
              <span className="text-base-content">{crumb[0]}</span>
            )}
          </li>
        </React.Fragment>
      ))}
      <li className="text-base-content">&raquo;</li>
      <li>
        <span className="text-base-content">{title}</span>
      </li>
    </ul>
  )
}

const asideClasses = `
  fixed top-0 right-0
  pt-28
  sm:pt-8 sm:mt-16
  pb-4 px-2
  sm:relative sm:transform-none
  h-screen w-screen
  bg-base-100
  sm:bg-base-50
  sm:flex
  sm:sticky
  overflow-y-scroll
  z-20
  bg-base-100 text-base-content
  sm:bg-neutral sm:bg-opacity-95 sm:text-neutral-content
  transition-all `

const DefaultLayout = ({ app, title = false, crumbs = [], children = [] }) => {
  const startNavigation = () => {
    app.startLoading()
    // Force close of menu on mobile if it is open
    if (app.primaryNavigation) app.setPrimaryNavigation(false)
  }

  const router = useRouter()
  router.events?.on('routeChangeStart', startNavigation)
  router.events?.on('routeChangeComplete', () => app.stopLoading())
  const slug = router.asPath.slice(1)

  return (
    <div
      className={`
    flex min-h-screen flex-col
    justify-between
    bg-base-100
    `}
    >
      <Header app={app} />
      <main
        className={`
        flex grow flex-row
        gap-2
      `}
      >
        <section
          className={`
          w-full pt-24 sm:pt-28
        `}
        >
          <div className={title ? 'm-auto max-w-6xl' : ''}>
            {title && (
              <>
                <Breadcrumbs {...{ title, crumbs }} />
                <h1>{title}</h1>
              </>
            )}
            {children}
          </div>
        </section>
      </main>
      <Footer app={app} />
    </div>
  )
}

export default DefaultLayout
