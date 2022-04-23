import { useState, useEffect } from 'react'
import Logo from 'components/logos/vahi.js'
import Link from 'next/link'
import ThemePicker from 'components/theme-picker.js'
import LocalePicker from 'components/locale-picker.js'
import CloseIcon from 'components/icons/close.js'
import MenuIcon from 'components/icons/menu.js'
import LoginIcon from 'components/icons/login.js'
import LogoutIcon from 'components/icons/logout.js'
import { useTranslation } from 'next-i18next'
import AdminMenu from 'components/admin/menu.js'
import config from '../vahi.config.mjs'
import { useRouter } from 'next/router'

const Right = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
)
const Left = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
)

const Header = ({ app }) => {
  const { t } = useTranslation()
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [show, setShow] = useState(true)
  const router = useRouter()
  const lang = router.locale || 'en'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const curScrollPos = typeof window !== 'undefined' ? window.pageYOffset : 0
        if (curScrollPos >= prevScrollPos) {
          if (show && curScrollPos > 20) setShow(false)
        } else setShow(true)
        setPrevScrollPos(curScrollPos)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos, show])

  const queer = ['trans', 'lgbtq'].indexOf(app.theme) !== -1

  return (
    <header
      className={`
        fixed top-0 left-0
        z-30
        w-full
        bg-neutral
        transition-transform
        ${show ? '' : 'fixed top-0 left-0 -translate-y-20'}
      `}
    >
      <div className="m-auto max-w-6xl">
        <div className="flex flex-row justify-between gap-2 p-2 text-neutral-content">
          <button
            className={`
                btn btn-sm h-12
                border border-transparent
                bg-transparent text-neutral-content
                hover:border-base-100
                hover:bg-transparent
                sm:hidden
              `}
            onClick={app.togglePrimaryMenu}
          >
            {app.primaryMenu ? (
              <>
                <CloseIcon />
                <span className="flex flex-row items-center gap-1 pl-2 opacity-50">
                  <Left />
                  swipe
                </span>
              </>
            ) : (
              <>
                <MenuIcon />
                <span className="flex flex-row items-center gap-1 pl-2 opacity-50">
                  <Right />
                  swipe
                </span>
              </>
            )}
          </button>
          <div className="hidden flex-row items-center sm:flex">
            {app.admin?.isActive && <AdminMenu app={app} />}
            {app.user?.id
              ? (
                <Link href="/invite">
                  <a className="btn btn-ghost text-neutral-content">
                    <LogoutIcon />
                    <span className="pl-4">{t('logout')}</span>
                  </a>
                </Link>
              )
              : (
                <Link href="/invite">
                  <a className="btn btn-ghost text-neutral-content">
                    <LoginIcon />
                    <span className="pl-4">{t('login')}</span>
                  </a>
                </Link>
              )
            }
          </div>
          <div className="hidden gap-2 md:flex md:flex-row">
            <Link href="/">
              <a role="button" className="btn btn-ghost text-neutral-content">
                {config.branding.header.logo && <Logo size={24} fill="currentColor" stroke={false} />}
                {config.branding.header.brand && <span className="pl-4">{config.branding.brand[lang]}</span>}
              </a>
            </Link>
          </div>
          <div className="hidden flex-row items-center sm:flex">
            <ThemePicker app={app} />
            <LocalePicker app={app} />
          </div>
        </div>
      </div>
      <div
        className={`theme-gradient relative z-10 -mb-1 w-full ${app.loading ? 'loading h-1' : ''}`}
      ></div>
    </header>
  )
}

export default Header
