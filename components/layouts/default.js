import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Header from 'components/header'
import Footer from 'components/footer'
import AdminMenu from 'components/admin/menu.js'
import ThemePicker from 'components/theme-picker.js'
import LocalePicker from 'components/locale-picker.js'
import CloseIcon from 'components/icons/close.js'
import MenuIcon from 'components/icons/menu.js'
import LoginIcon from 'components/icons/login.js'
import LogoutIcon from 'components/icons/logout.js'
import ScaleIcon from 'components/icons/scale.js'
import Link from 'next/link'
import config from '../../vahi.config.mjs'
import Logo from 'components/logos/vahi.js'

const asideClasses = `
  fixed top-0 right-0
  pt-16 pb-4 px-8
  h-screen w-screen
  overflow-y-scroll
  z-20
  sm:hidden
  bg-base-100 text-base-content
  transition-all `

const DefaultLayout = ({ app, children = [] }) => {
  const { t } = useTranslation(['vahi', 'admin'])
  const startNavigation = () => {
    app.startLoading()
    // Force close of menu on mobile if it is open
    if (app.primaryNavigation) app.setPrimaryNavigation(false)
  }

  const router = useRouter()
  const lang = router.locale || 'en'
  router.events?.on('routeChangeStart', startNavigation)
  router.events?.on('routeChangeComplete', () => app.stopLoading())
  const slug = router.asPath.slice(1)

  return (
    <div className={`
      flex min-h-screen flex-col
      justify-between
      bg-base-100
    `}>
      <Header app={app} />
      <main
        className={`
        flex grow flex-row
        gap-2
      `}
      >
        <aside className={`
          ${asideClasses}
          ${app.primaryMenu ? '' : 'translate-x-[-100%]'} transition-transform
        `}>
          {config.branding.header.logo || config.branding.header.brand
            ? (
              <Link href="/">
                <a role="button" className="btn btn-primary btn-outline w-full mt-4">
                  {config.branding.header.logo && <Logo size={24} fill="currentColor" stroke={false} />}
                  {config.branding.header.brand && <span className="pl-4">{config.branding.brand[lang]}</span>}
                </a>
              </Link>
            ) : null
          }
          <div className="flex flex-row gap-4 my-4 justify-between">
            <ThemePicker app={app} className="w-1/2"/>
            <LocalePicker app={app} className="w-1/2"/>
          </div>
          {app.admin?.isActive && (
            <>
              <h3>{t('admin:administration')}</h3>
              <AdminMenu app={app} list />
            </>
          )}
          {app.user?.id
            ? (
              [
                <Link href="/grade">
                  <a className="btn btn-primary w-full mt-8">
                    <ScaleIcon />
                    <span className="pl-4">{t('gradeIt', { it: t('eyes') })}</span>
                  </a>
                </Link>,
                <button className="btn btn-primary btn-outline w-full mt-8" onClick={app.logout}>
                  <LogoutIcon />
                  <span className="pl-4">{t('logout')}</span>
                </button>,
              ]
            )
            : (
              <Link href="/invite">
                <a className="btn btn-primary w-full mt-8">
                  <LoginIcon />
                  <span className="pl-4">{t('login')}</span>
                </a>
              </Link>
            )
          }
          
        </aside>
        <section className="w-full py-24 sm:py-28 px-0 xl:px-0">
          {children}
        </section>
      </main>
      <Footer app={app} />
    </div>
  )
}

export default DefaultLayout
