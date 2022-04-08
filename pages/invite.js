import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const InvitePage = (props) => {
  const app = useApp()
  const { t } = useTranslation()

  return (
    <Page app={app} title={t('login')}>
      <div className="m-auto mb-12 max-w-xl">
        <div className="m-auto flex max-w-7xl flex-row flex-wrap content-start justify-between">
          <div className="max-w-lg">
            <div className="mt-4 max-w-prose rounded-lg bg-accent p-8 px-8 drop-shadow">
              <h4 className="text-xl font-bold text-accent-content lg:text-2xl">
                {t('tryVahiTitle')}
              </h4>
              <p
                className="text-accent-content"
                dangerouslySetInnerHTML={{ __html: t('tryVahiMsg') }}
              />
              <button className="btn btn-outline mt-4 w-full text-accent-content">
                <LoginIcon />
                <span className="pl-4">{t('login')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default InvitePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
