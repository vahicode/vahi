import AdminIcon from 'components/icons/database.js'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import UserIcon from 'components/icons/user.js'
import EyeIcon from 'components/icons/eye.js'
import ScaleIcon from 'components/icons/scale.js'
import { capitalize } from 'components/utils.js'
import LogoutIcon from 'components/icons/logout.js'
import ExportIcon from 'components/icons/export.js'

const choices = {
  app: ['users', 'eyes'],
  admin: ['administrators']
}
const icons = {
  users: <UserIcon />,
  eyes: <EyeIcon />,
  administrators: <AdminIcon />,
}

const AdminMenu = ({ app, list=false }) => {
  const { t } = useTranslation(['admin', 'vahi', 'errors'])
  
  const links = [
    {
      url: '/admin/users',
      title: t('users'),
      icon: <UserIcon />,
      className: '',
      only: ['admin', 'superadmin'],
    },
    {
      url: '/admin/eyes',
      title: t('eyes'),
      icon: <EyeIcon />,
      className: '',
      only: ['dataentry', 'admin', 'superadmin'],
    },
    { spacer: true },
    {
      url: '/admin/add/users',
      title: t(`add${capitalize('users')}`),
      icon: <UserIcon />,
      className: 'text-primary',
      only: ['admin', 'superadmin'],
    },
    {
      url: '/admin/add/eyes',
      title: t(`add${capitalize('eye')}`),
      icon: <EyeIcon />,
      className: 'text-primary',
      only: ['dataentry', 'admin', 'superadmin'],
    },
    { spacer: true, only: ['dataentry', 'admin', 'superadmin'] },
    {
      url: '/admin/grades',
      title: t('grades'),
      icon: <ScaleIcon />,
      className: 'text-success',
      only: ['admin', 'superadmin']
    },
    {
      url: '/admin/export',
      title: t('exportData'),
      icon: <ExportIcon />,
      className: 'text-success',
      only: ['analyst', 'admin', 'superadmin']
    },
    { spacer: true, only: ['analyst', 'admin', 'superadmin'],
    },
    {
      url: '/admin/admins',
      title: t('administrators'),
      icon: <AdminIcon />,
      className: 'text-warning',
      only: ['superadmin'],
    },
    {
      url: '/admin/add/admins',
      title: t(`add${capitalize('administrators')}`),
      icon: <AdminIcon />,
      className: 'text-warning',
      only: ['superadmin'],
    },
    { spacer: true, only: ['superadmin'] },
    {
      onClick: app.logout,
      title: t('logout'),
      icon: <LogoutIcon />,
      className: 'text-error',
    },
  ]

  const lis = links.map(item => (!item.only || item.only.indexOf(app.admin.role) !== -1)
      ? item.spacer
        ? <li className="py-1"><hr className="p-0" /></li>
        : (
          <li key={item.url}>
            {item.onClick
              ? (
                <button className={`btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4 ${item.className}`} onClick={item.onClick}>
                  {item.icon}
                  <span className="text-base-content font-bold uppercase">{item.title}</span>
                </button>
              ) : (
                <Link href={item.url}>
                  <button className={`btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4 ${item.className}`}>
                    {item.icon}
                    <span className="text-base-content font-bold uppercase">{item.title}</span>
                  </button>
                </Link>
              )
            }
          </li>
        )
      : null
  )
  return list
  ?  <ul className="menu">{lis}</ul>
  : (
    <div className="dropdown">
      <div
        tabIndex="0"
        className={`
          btn-neutral btn m-0 flex flex-row gap-2
          hover:border-neutral-content
          hover:bg-neutral sm:btn-ghost
        `}
      >
        <AdminIcon className="w-6 h-6 text-success" />
        <span>{t("administration")}</span>
      </div>
      <ul tabIndex="0" className="dropdown-content menu w-80 rounded-box bg-base-100 p-2 shadow">{lis}</ul>
    </div>
  )
}

export default AdminMenu
