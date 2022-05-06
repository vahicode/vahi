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

const AdminAddUsersPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [count, setCount] = useState(1)
  const [notes, setNotes] = useState('')
  const [users, setUsers] = useState(false)
  const [error, setError] = useState(false)

  // Limit to creating 100 users in one go because this would be a nice
  // denial-of-service attack if someone requested 2 billion users
  const setCappedCount = val => {
    if (val > 100) setCount(100)
    else setCount(val)
  }

  const addUsers = async (evt) => {
    evt.preventDefault()
    setError(false)
    let result = false
    try {
      result = await axios.post('/api/users/add', { count: parseInt(count) , notes }, app.bearer())
    }
    catch(err) {
      if (err?.response?.data?.error === 'authentication_failed') setError({ warning: true, msg: t('loginFailed') })
      else if (err?.response?.data?.error) setError({ warning: true, msg: err.response.data.error })
      else setError({ warning: true, msg:  t('errors:unknownError') })
    }
    if (result?.data && Array.isArray(result.data) && result.data.length > 0) setUsers(result.data)
    else setError({ warning: true, msg: t('errors:unexpectedError') })
  }

  const crumbs = [
    { url: '/admin', title: t('administration') },
    { url: '/admin/users', title: t('users') },
  ]

  return (
    <Page app={app}>
      <AdminsOnly app={app}>
      <div className="form-control w-full m-auto">
        <BreadCrumbs crumbs={crumbs} title={t('addUsers')}/>
        <h1>{t('addUsers')}</h1>
        {error && <Popout compact {...error}>{error.msg}</Popout>}
        {users
          ? (
            <div className="max-w-lg">
              <h4>{t('vahi:inviteCode')}:</h4>
              <ol className="list-decimal list-inside pl-4">
                {users.map(user => <li key={user}><code className="font-mono text-accent py-2 pl-2">{user}</code></li>)}
              </ol>
              <button className="btn btn-primary mt-8 mb-4 w-full" onClick={() => setUsers(false)}>
                {t('addUsers')}
              </button>
            </div>
          )
          : (
            <form onSubmit={addUsers} className="max-w-lg">
              <label className="label">
                <span className="label-text">{t('numberOfUsers')}</span>
              </label>
              <input type="number" placeholder={t('numberOfUsers')} className="input input-bordered w-full" autoFocus={true} 
                value={count} onChange={evt => setCappedCount(evt.target.value)}/>
              <label className="label">
                <span className="label-text">{t('notes')}</span>
              </label>
              <textarea className="textarea textarea-bordered w-full" 
                placeholder={t('notes')} onChange={(evt) => setNotes(evt.target.value)}>{notes}</textarea>
              <button type="submit" className="btn btn-primary mt-8 mb-4 w-full" onClick={addUsers}>
                {t('addUsers')}
              </button>
            </form>
          )
        }
      </div>
      </AdminsOnly>
    </Page>
  )
}

export default AdminAddUsersPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
