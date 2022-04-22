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

const AdminAddAdminsPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState(false)

  const addAdmin = async (evt) => {
    evt.preventDefault()
    setError(false)
    let result = false
    try {
      result = await axios.post('/api/admins/add', { email, notes }, app.bearer())
    }
    catch(err) {
      if (err?.response?.data?.error === 'authentication_failed') setError({ warning: true, msg: t('loginFailed') })
      else if (err?.response?.data?.error) setError({ warning: true, msg: err.response.data.error })
      else setError({ warning: true, msg:  t('errors:unknownError') })
    }
    if (result?.data) setAdmin(result.data)
    else setError({ warning: true, msg: t('errors:unexpectedError') })
  }

  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/admins', title: t('administrators') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
      <div className="form-control w-full max-w-xl m-auto">
        <BreadCrumbs crumbs={crumbs} title={t('addAdministrators')}/>
        <h1>{t('addAdministrators')}</h1>
        {error && <Popout compact {...error}>{error.msg}</Popout>}
        {admin
          ? (
            <>
              <Popout note>
                <ul className="list-disc list-inside my-4">
                  <li><strong className="capitalize pr-2">{t('username')}:</strong> {admin.email}</li>
                  <li><strong className="capitalize pr-2">{t('role')}:</strong> {admin.role}</li>
                  <li><strong className="capitalize pr-2">{t('password')}:</strong> {admin.password}</li>
                </ul>
              </Popout>
              <hr className="my-8"/>
              <button className="btn btn-primary mt-8 mb-4 w-full" onClick={() => setAdmin(false)}>
                {t('addAdministrators')}
              </button>
            </>
          )
          : (
            <form onSubmit={addAdmin}>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" className="input input-bordered w-full" autoFocus={true} 
                value={email} onChange={evt => setEmail(evt.target.value)}/>
              <label className="label">
                <span className="label-text">{t('notes')}</span>
              </label>
              <textarea className="textarea textarea-bordered w-full" 
                placeholder={t('notes')} onChange={(evt) => setNotes(evt.target.value)}>{notes}</textarea>
              <button type="submit" className="btn btn-primary mt-8 mb-4 w-full" onClick={addAdmin}>
                {t('vahi:save')}
              </button>
            </form>
          )
        }
      </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminAddAdminsPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
