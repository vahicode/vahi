import { useState } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import Link from 'next/link'
import LoginIcon from 'components/icons/login.js'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Logo from 'components/logos/vahi.js'
import axios from 'axios'
import Popout from 'components/popout.js'

const AdminLogoutPage = (props) => {
  const app = useApp()
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [error, setError] = useState(false)

  const logout = async (evt) => {
    evt.preventDefault()
    setError(false)
    let result = false
    app.setToken(null)
    app.setAdmin(null)
  }

  return (
    <Page app={app}>
        <h1>
          <span>{t('administration')}: </span>
          <span>{t('admin:logout')}</span>
        </h1>
        <button type="submit" className="btn btn-primary mt-8 mb-4 w-full" onClick={logout}>
          {t('vahi:logout')}
        </button>
    </Page>
  )
}

export default AdminLogoutPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
