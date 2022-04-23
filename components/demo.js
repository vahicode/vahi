import config from '../vahi.config.mjs'
import { useTranslation } from 'next-i18next'
import DemoIcon from 'components/icons/demo.js'
import axios from 'axios'
import { useRouter } from 'next/router'

const Demo = ({ app }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const demoLogin = async () => {
    let result = false
    try {
      result = await axios.post('/api/user-login', { invite: 'demo' })
    }
    catch(err) {
      console.log(err)
    }
    if (result?.data?.token && result.data?.user) {
      app.setUserToken(result.data.token)
      app.setUser(result.data.user)
      router.push('/rate') // Go to rate page
    } 
  }

  return config.demo
    ? (
      <div className="mt-4 max-w-prose rounded-lg bg-accent p-8 px-8 drop-shadow">
        <h4 className="text-xl font-bold text-accent-content lg:text-2xl">
          {t('tryVahiTitle')}
        </h4>
        <p
          className="text-accent-content"
          dangerouslySetInnerHTML={{ __html: t('tryVahiMsg') }}
        />
        <button className="btn btn-outline mt-4 w-full text-accent-content" onClick={demoLogin}>
          <DemoIcon />
          <span className="pl-4">demo</span>
        </button>
      </div>
    ) : null
}

export default Demo
