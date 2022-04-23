import themes from 'themes/index.js'
import ThemeIcon from 'components/icons/theme.js'
import { useTranslation } from 'next-i18next'
import config from '../vahi.config.mjs'

const ThemePicker = ({ app, className }) => {
  const { t } = useTranslation(['themes', 'vahi'])

  return (
    <div className={`dropdown ${className}`}>
      <div
        tabIndex="0"
        className={`
          btn-neutral btn m-0 flex flex-row gap-2
          hover:border-neutral-content
          hover:bg-neutral sm:btn-ghost
        `}
      >
        <ThemeIcon />
        <span>{t(`${app.theme}Theme`)}</span>
      </div>
      <ul tabIndex="0" className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
        {config.branding.themes.map((theme) => (
          <li key={theme}>
            <button onClick={() => app.setTheme(theme)} className="btn btn-ghost hover:bg-base-200">
              <span className="text-base-content">{t(`${theme}Theme`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemePicker
