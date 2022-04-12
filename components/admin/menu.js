import AdminIcon from 'components/icons/database.js'
import { useTranslation } from 'next-i18next'

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
      <ul tabIndex="0" className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
        <li>
          <button onClick={() => app.setTheme(theme)} className="btn btn-ghost hover:bg-base-200">
            <span className="text-base-content">{t(`Theme`)}</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default AdminMenu
