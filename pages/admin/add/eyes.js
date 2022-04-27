import { useState } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import axios from 'axios'
import Popout from 'components/popout.js'
import AdminsOnly from 'components/admin/admins-only.js'
import BreadCrumbs from 'components/breadcrumbs.js'
import ReactDOM from 'react-dom'
import { FilePond, File, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const AdminAddEyesPage = (props) => {
  const app = useApp()
  const { headers } = app.bearer()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [files, setFiles] = useState([])
  const [error, setError] = useState(false)
  
  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/eyes', title: t('eyes') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <div className="form-control w-full max-w-xl m-auto">
          <BreadCrumbs crumbs={crumbs} title={t('addEyes')}/>
          <h1>{t('addEyes')}</h1>
          {error && <Popout compact {...error}>{error.msg}</Popout>}
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={10}
            server={{
              url: "/api/eyes/upload",
              process: { headers }
            }}
            name="files"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminAddEyesPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
