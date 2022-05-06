import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import Spinner from 'components/spinner.js'
import BreadCrumbs from 'components/breadcrumbs.js'

const AdminUsersPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [format, setFormat] = useState('sqlite')
  const [error, setError] = useState(false)
  const [download, setDownload] = useState(false)

  const crumbs = [
    { url: '/admin', title: t('administration') },
  ]

  const exportdb = () => {
    axios.get(`/api/export/${format}`, app.bearer())
    .then(res => {
      if (res.data) {
        let file 
        if (format === 'sqlite') file = new File([res.data], 'export.db')
        else if (format === 'json') file = new File([JSON.stringify(res.data, null ,2)], 'export.json')
        setDownload(URL.createObjectURL(file))
      } else {
        console.log(res)
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <BreadCrumbs crumbs={crumbs} title={t('exportData')}/>
        <div className="form-control w-full">
          <h1>{t('exportData')}</h1>
          <div className="max-w-lg">
            {download && (
              <Popout link>
                <a href={download}>Download your exported data here</a>
              </Popout>
            )}
            {['sqlite', 'json'].map(fmt => (
              <div key={fmt} className="form-control">
                <label className="label cursor-pointer">
                  <input type="radio" name="format" value={fmt} className="radio" checked={format === fmt} onChange={() => setFormat(fmt)}/>
                  <span className="label-text">{fmt}</span> 
                </label>
              </div>
            ))}
            <button className="btn btn-primary px-8 mt-8" onClick={exportdb}>Export</button>
          </div>
          {error ?
            error.component
              ? error.component
              : <Popout compact {...error}>{error.msg}</Popout>
            : null
          }
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminUsersPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
