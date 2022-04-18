import AdminIcon from 'components/icons/database.js'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import UserIcon from 'components/icons/user.js'
import PictureIcon from 'components/icons/picture.js'
import EyeIcon from 'components/icons/eye.js'
import { capitalize } from 'components/utils.js'
import LogoutIcon from 'components/icons/logout.js'
import ExportIcon from 'components/icons/export.js'

const choices = {
  app: ['users', 'pictures', 'eyes'],
  admin: ['administrators']
}
const icons = {
  users: <UserIcon />,
  pictures: <PictureIcon />,
  eyes: <EyeIcon />,
  administrators: <AdminIcon />,
}


const AdminMenu = ({ app }) => {
  const { t } = useTranslation(['admin', 'vahi', 'errors'])
  
  return (
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
      <ul tabIndex="0" className="dropdown-content menu w-80 rounded-box bg-base-100 p-2 shadow">
        {choices.app.map(item => (
          <li key={item}>
            <Link href={`/admin/${item}`}>
              <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4">
                {icons[item]}
                <span className="text-base-content font-bold uppercase">{t(item)}</span>
              </button>
            </Link>
          </li>
        ))}
        <li className="py-1"><hr className="p-0" /></li>
        {choices.app.map(item => (
          <li key={item}>
            <Link href={`/admin/add/${item}`}>
              <button className="btn-ghost hover:bg-base-200 text-primary flex flex-row gap-4">
                {icons[item]}
                <span className="text-base-content font-bold uppercase">{t(`add${capitalize(item)}`)}</span>
              </button>
            </Link>
          </li>
        ))}
        <li className="py-1"><hr className="p-0" /></li>
        <li>
          <Link href={`/admin/export`}>
            <button className="btn-ghost hover:bg-base-200 text-success flex flex-row gap-4">
              <ExportIcon />
              <span className="text-base-content font-bold uppercase">{t('exportData')}</span>
            </button>
          </Link>
        </li>
        <li className="py-1"><hr className="p-0" /></li>
        <li>
          <Link href={`/admin/admins`}>
            <button className="btn-ghost hover:bg-base-200 text-warning flex flex-row gap-4">
              <AdminIcon />
              <span className="text-base-content font-bold uppercase">{t('administrators')}</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href={`/admin/add/admins`}>
            <button className="btn-ghost hover:bg-base-200 text-warning flex flex-row gap-4">
              <AdminIcon />
              <span className="text-base-content font-bold uppercase">{t(`add${capitalize('administrators')}`)}</span>
            </button>
          </Link>
        </li>
        <li className="py-1"><hr className="p-0" /></li>
        <li>
          <Link href={`/admin/logout`}>
            <button className="btn-ghost hover:bg-base-200 text-accent flex flex-row gap-4">
              <LogoutIcon />
              <span className="text-base-content font-bold uppercase">{t('logout')}</span>
            </button>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminMenu
