import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'

const VaHI = ({ Component, pageProps }) => <Component {...pageProps} />

export default appWithTranslation(VaHI)
