import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Head from 'next/head'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import config from '../vahi.config.mjs'
import markdown from 'markdown/homepage.mjs'
import Markdown from 'react-markdown'
import { useRouter } from 'next/router'
import Demo from 'components/demo.js'

const HomePage = (props) => {
  const app = useApp()
  const { t } = useTranslation()
  const router = useRouter()
  const lang = router.locale || 'en'

  return (
    <Page app={app}>
      <div className="mb-20">
        <section
          style={{
            backgroundImage: "url('/img/banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: '70% 50%',
          }}
          className="mt-4 mb-8 shadow drop-shadow-lg lg:mt-8 lg:mb-20"
        >
          <div className="mx-auto max-w-4xl px-8 py-12 lg:py-20">
            <h1
              className="text-8xl font-light lg:text-8xl"
              style={{ textShadow: '1px 1px 3px #000', color: 'white' }}
            >
              {config.branding.brand[lang]}
            </h1>
            <h2
              className="w-2/3 text-2xl lg:max-w-xl lg:text-4xl xl:pr-0"
              style={{ textShadow: '1px 1px 3px #000', color: 'white' }}
            >
              {config.branding.slogan[lang]}
            </h2>
          </div>
        </section>

        <div className="m-auto flex max-w-7xl flex-row flex-wrap content-start justify-between">
          <div className="max-w-prose px-8 m-auto">
            <Markdown>{markdown[lang]}</Markdown>
          </div>
          <div className="max-w-lg px-8 m-auto lg:px-0">
            <div className="mt-4 max-w-prose rounded-lg bg-primary p-8 px-8 drop-shadow">
              <h4 className="text-xl font-bold text-primary-content lg:text-2xl">
                {t('takePartTitle')}
              </h4>
              <p className="text-primary-content">{t('takePartMsg')}</p>
              <Link href="/invite">
                <a className="btn btn-outline mt-4 w-full text-primary-content">
                  <LoginIcon />
                  <span className="pl-4">{t('login')}</span>
                </a>
              </Link>
            </div>
            <Demo app={app} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default HomePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
