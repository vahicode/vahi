import Logo from 'components/logos/vahi.js'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

const Footer = ({ app }) => {
  const { t } = useTranslation()

  return (
    <footer className="bg-neutral">
      <div className="theme-gradient h-12 drop-shadow-xl" />
      <div
        className={`
        z-0 -mt-1 flex flex-row flex-wrap justify-around gap-8 p-4 pt-16 pb-8 
        text-neutral-content
      `}
      >
        <div className="text-center">
          <Logo fill="currentColor" stroke="none" size={124} className="m-auto" />
          <h5 className="pb-0 text-4xl text-neutral-content">VaHI</h5>
          <p className="m-auto w-72 font-bold text-neutral-content">{t('tagline')}</p>
          <p className="mt-8 text-sm text-neutral-content">
            <a
              href="https://www.researchgate.net/profile/Sorcha_Dhubhghaill"
              className="font-bold underline"
            >
              Prof. Dr. Sorcha Ní Dhubhghaill
            </a>{' '}
            is the driving force behind VaHI
            <br />
            <a href="https://github.com/joostdecock" className="font-bold underline">
              Joost De Cock
            </a>{' '}
            is the developer of VaHI
          </p>
          <p className="mt-4 text-sm font-bold text-neutral-content">
            <Link href="/contact">
              <a title={t('contactUs')} className="underline">
                {t('contactUs')}
              </a>
            </Link>
            <span className="px-2">|</span>
            <a
              title={t('sourceCode')}
              href="https://github.com/vahicode/vahi"
              className="underline"
            >
              {t('sourceCode')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
