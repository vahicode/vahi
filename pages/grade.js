import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import BreadCrumbs from 'components/breadcrumbs.js'
import Grade from 'components/grade/index.js'

const RatingPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['vahi', 'errors'])

  return (
    <Page app={app}>
      <div className="w-full max-w-7xl m-auto">
        <BreadCrumbs title={t('gradeIt', { it: t('eyes') })}/>
        <h1>{t('gradeIt', { it: t('eyes') })}</h1>
        <Grade app={app} />
      </div>
    </Page>
  )
}

export default RatingPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
