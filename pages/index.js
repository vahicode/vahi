import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Head from 'next/head'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const HomePage = (props) => {
  const app = useApp()
  const { t } = useTranslation()

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
              VaHI
            </h1>
            <h2
              className="w-2/3 text-2xl lg:max-w-xl lg:text-4xl xl:pr-0"
              style={{ textShadow: '1px 1px 3px #000', color: 'white' }}
            >
              {t('tagline')}
            </h2>
          </div>
        </section>

        <div className="m-auto flex max-w-7xl flex-row flex-wrap content-start justify-between">
          <div className="max-w-prose px-8">
            <h3 className="text-2xl font-bold lg:text-3xl">{t('welcomeTitle')}</h3>
            <p dangerouslySetInnerHTML={{ __html: t('welcomeP1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('welcomeP2') }} />
            <div className="p-12">
              <a href="https://www.arrestblindness.eu/">
                <img src="/img/arrestblindness.png" />
              </a>
            </div>
          </div>
          <div className="max-w-lg">
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
            <div className="mt-4 max-w-prose rounded-lg bg-accent p-8 px-8 drop-shadow">
              <h4 className="text-xl font-bold text-accent-content lg:text-2xl">
                {t('tryVahiTitle')}
              </h4>
              <p
                className="text-accent-content"
                dangerouslySetInnerHTML={{ __html: t('tryVahiMsg') }}
              />
              <Link href="/invite">
                <a className="btn btn-outline mt-4 w-full text-accent-content">
                  <LoginIcon />
                  <span className="pl-4">{t('login')}</span>
                </a>
              </Link>
            </div>
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
