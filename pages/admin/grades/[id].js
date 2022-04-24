import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import Grade from 'components/admin/grade.js'
import Spinner from 'components/spinner.js'
import { useRouter } from 'next/router'
import BreadCrumbs from 'components/breadcrumbs.js'

const AdminGradePage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])
  const router = useRouter()
  const { id } = router.query

  const [grade, setGrade] = useState(false)
  const [error, setError] = useState(false)
  const [update, setUpdate] = useState(0)

  useEffect(async () => {
    try {
      const result = await axios.get(`/api/grades/get/${id}`, app.bearer())
      if (result.data) setGrade(result.data)
      else router.push('/admin/grades') // deleted or not existing
    }
    catch (err) {
      setError({ warning: true, msg:  t('errors:unknownError') })
    }
  }, [update, id])

  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/grades', title: t('grades') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <BreadCrumbs crumbs={crumbs} title={id}/>
        <div className="form-control w-full">
          <h1>{t('grades')}: #{id}</h1>
          {error && <Popout compact {...error}>{error.msg}</Popout>}
          {grade
            ? <Grade grade={grade} app={app} setUpdate={setUpdate} />
            : <Spinner />
          }
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminGradePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}

// No need to staticly generate this
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
