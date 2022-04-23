import Popout from 'components/popout.js'
import { useTranslation } from 'next-i18next'

const AccessDenied = () => {
  const { t } = useTranslation(['errors'])
  return (
    <Popout error noHide>
      <h2 className="m-0 p-2">{t('accessDenied')}</h2>
    </Popout>
  )
}

export default AccessDenied
