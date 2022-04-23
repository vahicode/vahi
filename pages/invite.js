import { useState } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Logo from 'components/logos/vahi.js'
import axios from 'axios'
import { useRouter } from 'next/router'

const InvitePage = (props) => {
  const app = useApp()
  const { t } = useTranslation()
  const router = useRouter()

  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const login = async () => {
    let result = false
    try {
      result = await axios.post('/api/user-login', { invite: code })
    }
    catch(err) {
      if (err?.response?.data?.error === 'login_failed') setError({ warning: true, msg: t('loginFailed') })
    }
    if (result?.data?.token && result.data?.user) {
      app.setUserToken(result.data.token)
      app.setUser(result.data.user)
      router.push('/grade') // Go to grading page
    } 
    else setError({ warning: true, msg: t('errors:unexpectedError') })
    
  }

  return (
    <Page app={app}>
      <div className={`
        mb-12 max-w-4xl flex flex-row flex-wrap justify-center 
        lg:justify-between m-auto px-8 lg:px-4 gap-12 lg:gap-0
      `}>
        <div className="form-control w-full max-w-sm">
          <h1><span>{t('login')}</span></h1>
          <label className="label">
            <span className="label-text">{t('enterInviteCode')}</span>
          </label>
          <input type="text" placeholder={t('inviteCode')} className="input input-bordered w-full" 
            value={code} onChange={evt => setCode(evt.target.value)}/>
          <button className="btn btn-primary mt-8" onClick={login}>
            {t('login')}
          </button>
        </div>

        <div className="max-w-sm lg:max-w-xs mt-4 lg:mt-5">
          <div className="mt-4 max-w-prose rounded-lg bg-accent p-8 px-8 drop-shadow">
            <h4 className="text-xl font-bold text-accent-content lg:text-2xl">
              {t('tryVahiTitle')}
            </h4>
            <p
              className="text-accent-content"
              dangerouslySetInnerHTML={{ __html: t('tryVahiMsg') }}
            />
          </div>
          <div className="mt-12">
            <a href="https://www.arrestblindness.eu/">
              <img src="/img/arrestblindness.png" />
            </a>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default InvitePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
