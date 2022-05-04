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
import { FilePond, File, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import config from '../../../vahi.config.mjs'
import { useRouter } from 'next/router'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const AdminAddEyesPage = (props) => {
  const app = useApp()
  const { headers } = app.bearer()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])
  const router = useRouter()

  const [vimg, setVimg] = useState([])
  const [iimg, setIimg] = useState([])
  const [vimgId, setVimgId] = useState(false)
  const [iimgId, setIimgId] = useState(false)
  const [error, setError] = useState(false)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)
  
  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/eyes', title: t('eyes') },
  ]

  const createEye = async (evt) => {
    evt.preventDefault()
    let result
    try {
      const data = { notes }
      if (config.grade.v || config.grade.h) data.vimg = vimgId
      if (config.grade.i) data.iimg = iimgId
      result = await axios.post('/api/eyes/add', data, app.bearer())
      if (result.data) router.push(`/admin/eyes/${result.data.id}`)
    }
    catch (err) {
    }
  }

  const pondProps = {
    allowMultiple: false,
    allowRevert: false,
    maxFiles: 1,
    labelIdle: t('filedrop'),
  }

  const vhTitle = t('imgForThing', {
    thing: (config.grade.v && config.grade.h)
      ? `${t('vahi:vascularisation')} + ${t('vahi:haze')}`
      : config.grade.v
      ? t('vahi:vascularisation') 
      : t('vahi:haze')
  })


  return (
    <Page app={app}>
      <AdminsOnly app={app}>
        <div className="form-control w-full max-w-xl m-auto">
          <BreadCrumbs crumbs={crumbs} title={t('addEye')}/>
          <h1>{t('addEye')}</h1>
          {(config.grade.v || config.grade.h) && (
            <>
              <h4>{vhTitle}</h4>
              <p className="text-sm p-0 m-0 -mt-2 mb-2">{t('vimgDesc')}</p>
              <FilePond
                {...pondProps}
                name="vimg"
                onprocessfile={(err, file) => err ? null : setVimgId(file.serverId)}
                server={{
                  url: "/api/img/add/vimg",
                  process: { headers }
                }}
              />
            </>
          )}
          {config.grade.i && (
            <>
              <h4>{t('imgForThing', { thing: t('vahi:integrity')})}</h4>
              <p className="text-sm p-0 m-0 -mt-2 mb-2">{t('iimgDesc')}</p>
              <FilePond
                {...pondProps}
                name="iimg"
                onprocessfile={(err, file) => err ? null : setIimgId(file.serverId)}
                server={{
                  url: "/api/img/add/iimg",
                  process: { headers }
                }}
              />
            </>
          )}
          <form onSubmit={createEye}>
            <h4>{t('notes')}</h4>
            <textarea rows={8} placeholder={t('notes')} className="input input-bordered w-full h-64 text-lg p-4" 
              onChange={evt => setNotes(evt.target.value)}>
              {notes}
            </textarea>
          <table className="my-4 w-full">
            <tbody>
              {(config.grade.v || config.grade.h) && (
                <tr>
                  <td className="pr-4 py-4 border-y"><span role="img" className='text-xl'>{vimgId ? '✅' : '❌'}</span></td>
                  <td className='pr-4 py-4 font-bold text-xl border-y'>{vhTitle}</td>
                  <td className="pr-4 py-4 border-y">{vimgId ? `#${vimgId}` : t('vimgDesc')}</td>
                </tr>
              )}
              {config.grade.i && (
                <tr>
                  <td className="pr-4 py-4 border-y"><span role="img" className='text-xl'>{iimgId ? '✅' : '❌'}</span></td>
                  <td className='pr-4 py-4 font-bold text-xl border-y'>{t('imgForThing', { thing: t('vahi:integrity')})}</td>
                  <td className="pr-4 py-4 border-y">{iimgId ? `#${iimgId}` : t('iimgDesc')}</td>
                </tr>
              )}
              <tr>
                <td className="pr-4 py-4 border-y"><span role="img" className='text-xl'>✅</span></td>
                <td className='pr-4 py-4 font-bold text-xl border-y'>{t('notes')}</td>
                <td className="pr-4 py-4 border-y"><span>{notes}</span></td>
              </tr>
            </tbody>
          </table>
            <button 
              type="submit" 
              className="btn btn-primary mt-8 mb-4 w-full" 
              onClick={createEye} 
              disabled={(vimgId && iimgId) ? false : true}
            >
              {t('addEye')}
            </button>
          </form>
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
