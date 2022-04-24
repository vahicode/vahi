import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

const AdminsOnly = ({ app, children }) => {
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  return (app?.admin) 
  ? (
    <div className="w-full max-w-7xl m-auto px-8 lg:px-0 mb-12">
      {children}
    </div>
  )
  : (
    <div className="form-control w-full max-w-xl m-auto px-8 xl:px-0">
      <h1>{t('adminOnly')}</h1>
      <Link href='/admin'>
        <a className="btn btn-primary mt-8 mb-4 w-full" >
          {t('vahi:login')}
        </a>
      </Link>
    </div>
  )
}

export default AdminsOnly
