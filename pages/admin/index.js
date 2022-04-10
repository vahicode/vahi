import { useState } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Logo from 'components/logos/vahi.js'
import axios from 'axios'

const AdminLoginPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi'])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [error, setError] = useState(false)

  const login = async () => {
    let result = false
    try {
      result = await axios.post('/api/login', { invite: code })
    }
    catch(err) {
      console.log(err)
    }
    
    console.log(result)
  }

  return (
    <Page app={app}>
      <div className="form-control w-full max-w-md m-auto">
        <h1>
          <span>{t('administration')}: </span>
          <span>{t('vahi:login')}</span>
        </h1>
        <label className="label">
          <span className="label-text">{t('adminUsername')}</span>
        </label>
        <input type="text" placeholder={t('adminUsername')} className="input input-bordered w-full" 
          value={username} onChange={evt => setUsername(evt.target.value)}/>
        <label className="label">
          <span className="label-text">{t('adminPassword')}</span>
        </label>

        <label className="input-group">
          <input
            type={reveal ? "text" : "password"}
            placeholder={t('adminPassword')}
            className={`
              input input-bordered grow text-base-content border-r-0
            `}
            value={password}
            onChange={evt => setPassword(evt.target.value)}
          />
          <button 
            className={`border border-primary` }
            onClick={() => setReveal(!reveal)}
          >
            <span role="img" className={`bg-transparent`}>
              {reveal ? '👀' : '🙈'}
            </span>
          </button>
        </label>


        <button className="btn btn-primary mt-8" onClick={login}>
          {t('vahi:login')}
        </button>
      </div>
    </Page>
  )
}

export default AdminLoginPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}