import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import Eyes from 'components/admin/eyes.js'
import Spinner from 'components/spinner.js'
import BreadCrumbs from 'components/breadcrumbs.js'
import AccessDenied from 'components/access-denied.js'

const AdminEyesPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [eyes, setEyes] = useState(false)
  const [error, setError] = useState(false)
  const [update, setUpdate] = useState(0)

  const crumbs = [
    { url: '/admin', title: t('administration') },
  ]

  useEffect(async () => {
    try {
      const result = await axios.get('/api/eyes', app.bearer())
      if (result.data) setEyes(result.data)
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

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <BreadCrumbs crumbs={crumbs} title={t('eyes')}/>
        <div className="form-control w-full">
          <h1>{t('eyes')}</h1>
          {error ?
            error.component
              ? error.component
              : <Popout compact {...error}>{error.msg}</Popout>
            : null
          }
          {eyes
            ? <Eyes eyes={eyes} app={app} setUpdate={setUpdate}/>
            : error ? null : <Spinner />
          }
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminEyesPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
