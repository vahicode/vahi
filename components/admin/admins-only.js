import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

const AdminsOnly = ({ app, children }) => {
  const { t } = useTranslation(['admin', 'vahi', 'errors'])

  return (
    <div className="w-full max-w-7xl m-auto px-8 lg:px-0 mb-12">
    {app?.admin 
      ? children
      : (
        <>
          <h1 className="text-center">{t('adminOnly')}</h1>
          <p className="text-center">
            <Link href='/admin'>
              <a className="btn btn-primary mt-8 mb-4 w-64 m-auto" >
                {t('vahi:login')}
              </a>
            </Link>
          </p>
        </>
      )
    }
    </div>
  )
}

export default AdminsOnly
