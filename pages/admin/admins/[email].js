import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import Admin from 'components/admin/admin.js'
import Spinner from 'components/spinner.js'
import { useRouter } from 'next/router'
import BreadCrumbs from 'components/breadcrumbs.js'

const AdminAdminPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])
  const router = useRouter()
  const { email } = router.query

  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState(false)
  const [update, setUpdate] = useState(0)

  useEffect(async () => {
    try {
      const result = await axios.get(`/api/admins/get/${email}`, app.bearer())
      if (result.data) setAdmin(result.data)
      else setError({ warning: true, msg:  t('errors:unknownError') })
    }
    catch (err) {
      setError({ warning: true, msg:  t('errors:unknownError') })
    }
  }, [update, email])

  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/admins', title: t('administrators') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <BreadCrumbs crumbs={crumbs} title={`#${admin.email}`}/>
        <div className="form-control w-full">
          <h1>{t('administrators')}: {admin?.email}</h1>
          {error && <Popout compact {...error}>{error.msg}</Popout>}
          {admin
            ? <Admin admin={admin} app={app} setUpdate={setUpdate}/>
            : <Spinner />
          }
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminAdminPage

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
