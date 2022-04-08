import { useSwipeable } from 'react-swipeable'
import { useTranslation } from 'next-i18next'
import Layout from 'components/layouts/default'
import Head from 'next/head'

/* This component should wrap all page content */
const PageWrapper = (props) => {
  const { t } = useTranslation()

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (evt) => (props.app.primaryMenu ? props.app.setPrimaryMenu(false) : null),
    onSwipedRight: (evt) => (props.app.primaryMenu ? null : props.app.setPrimaryMenu(true)),
    trackMouse: true,
  })

  const childProps = {
    app: props.app,
    title: props.title,
  }

  return (
    <div
      ref={swipeHandlers.ref}
      onMouseDown={swipeHandlers.onMouseDown}
      data-theme={props.app.theme}
      key={props.app.theme} // Thiis forces the data-theme update
    >
      <Head>
        <meta property="og:title" content="VaHI" key="title" />
        <meta property="og:type" content="article" key="type" />
        <meta property="og:description" content={t('tagline')} key="description" />
        <meta property="og:article:author" content="Joost De Cock" key="author" />
        <meta property="og:image" content="https://vahi.eu/img/banner.jpg" key="image" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1059" />
        <meta property="og:url" content="https://vahi.eu/" key="url" />
        <meta property="og:locale" content="en_US" key="locale" />
        <meta property="og:site_name" content="vahi.eu" key="site" />
      </Head>
      {props.noLayout ? props.children : <Layout {...childProps}>{props.children}</Layout>}
    </div>
  )
}

export default PageWrapper
