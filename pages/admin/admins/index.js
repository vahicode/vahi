import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import Admins from 'components/admin/admins.js'
import Spinner from 'components/spinner.js'
import BreadCrumbs from 'components/breadcrumbs.js'
import AccessDenied from 'components/access-denied.js'

const AdminAdminsPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [admins, setAdmins] = useState(false)
  const [error, setError] = useState(false)
  const [update, setUpdate] = useState(0)

  useEffect(async () => {
    try {
      const result = await axios.get('/api/admins', app.bearer())
      if (result.data) setAdmins(result.data)
      else setError({ warning: true, msg:  t('errors:unknownError') })
    }
    catch (err) {
      setError({ 
        warning: true, 
        msg: t('errors:unknownError'),
        component: err.response?.data?.error === 'authentication_failed'
          ? <AccessDenied />
          : false
      })
    }
  }, [update])

  const crumbs = [
    { url: '/admin', title: t('administration') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <BreadCrumbs crumbs={crumbs} title={t('administrators')}/>
        <div className="form-control w-full">
          <h1>{t('administrators')}</h1>
          {error ?
            error.component
              ? error.component
              : <Popout compact {...error}>{error.msg}</Popout>
            : null
          }
          {admins
            ? <Admins admins={admins} app={app} setUpdate={setUpdate} setError={setError}/>
            : error ? null : <Spinner />
          }
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminAdminsPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
