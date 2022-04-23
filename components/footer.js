import Logo from 'components/logos/vahi.js'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import config from '../vahi.config.mjs'
import { useRouter } from 'next/router'
import markdown from 'markdown/footer.mjs'
import Markdown from 'react-markdown'

const Footer = ({ app }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const lang = router.locale || 'en'

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
          {config.branding.footer.logo && <Logo fill="currentColor" stroke="none" size={124} className="m-auto" />}
          <h5 className="pb-0 text-4xl text-neutral-content">{config.branding.brand[lang]}</h5>
          <p className="m-auto w-72 font-bold text-neutral-content">{config.branding.slogan[lang]}</p>
          <div id='footer-md' className='my-8 max-w-prose'>
            <Markdown>{markdown[lang]}</Markdown>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
