import { useRouter } from 'next/router'
import Header from 'components/header'
import Footer from 'components/footer'

const DefaultLayout = ({ app, children = [] }) => {
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
          {children}
        </section>
      </main>
      <Footer app={app} />
    </div>
  )
}

export default DefaultLayout
