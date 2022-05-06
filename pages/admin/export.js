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

// Feel free to implement more export formats
const formats = ['json']

const AdminUsersPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [format, setFormat] = useState('json')
  const [error, setError] = useState(false)
  const [download, setDownload] = useState(false)

  const crumbs = [
    { url: '/admin', title: t('administration') },
  ]

  const exportdb = () => {
    setDownload(false)
    axios.get(`/api/export/${format}`, app.bearer())
    .then(res => {
      if (res.data) {
        let file 
        if (format === 'json') file = new File([JSON.stringify(res.data, null ,2)], 'export.json')
        setDownload([URL.createObjectURL(file), file.name])
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
            {formats.map(fmt => (
              <div key={fmt} className="form-control">
                <label className="label cursor-pointer flex flex-row gap-4 items-center justify-start">
                  <input type="radio" name="format" value={fmt} className="radio" checked={format === fmt} onChange={() => setFormat(fmt)}/>
                  <span className="label-text font-bold uppercase">{fmt}</span> 
                </label>
              </div>
            ))}
            <button className="btn btn-primary px-8 mt-8" onClick={exportdb}>{t('exportData')}</button>
            {download
              ? (
                  <a 
                    className="btn btn-primary btn-outline px-8 mt-8 ml-4" 
                    download={download[1]} 
                    href={download[0]}
                  >
                    {t('downloadThing', { thing: format })}
                  </a>
                ) : null
            }
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
