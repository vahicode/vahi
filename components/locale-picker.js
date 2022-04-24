import themes from 'themes/index.js'
import LocaleIcon from 'components/icons/i18n.js'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

const languages = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
}

const LocalePicker = ({ app, className='' }) => {
  const { t } = useTranslation(['vahi'])
  const router = useRouter()

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
        <LocaleIcon />
        <span>{languages[router.locale]}</span>
      </div>
      <ul tabIndex="0" className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
        {router.locales.map((locale) => (
          <li key={locale}>
            <Link href={router.asPath} locale={locale}>
              <a className="btn btn-ghost text-base-content hover:bg-base-200">
                <span className="text-base-content">{languages[locale]}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LocalePicker
