import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import config from '../vahi.config.mjs'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

const shadow = {textShadow: '1px 1px 3px #000', color: 'white' }

const Layout = ({ children }) => (
  <div className="min-h-screen"
    style={{
      // This is a hack to fake grayscale as an indication that VaHI is uninitialized
      backgroundImage: "linear-gradient(black, black), url('/img/banner.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: '70% 50%',
      backgroundBlendMode: 'saturation'
      
    }}
  >
    <div className="m-auto max-w-7xl flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="font-light text-8xl" style={shadow}>
          {config.branding.brand.en}
        </h1>
        <h2 className="text-2xl lg:max-w-xl lg:text-4xl" style={shadow}>
          {config.branding.slogan.en}
        </h2>
      </div>
      {children}
    </div>
  </div>
)

const StartPage = (props) => {
  const app = useApp()
  const router = useRouter()

  const [status, setStatus] = useState(false)
  const [admin, setAdmin] = useState(false)

  // Don't even bother if the app is initialized
  useEffect(async () => {
    let result
    try {
      result = await axios.get('/api/status')
      if (result.data) setStatus(result.data)
      if (result.data.initialized) router.push('/')
    }
    catch (err) {
      console.log(err)
    }
  }, [])

  const start = async () => {
    let result
    try {
      result = await axios.post('/api/start')
      if (result.data && result.data.admin) {
        setAdmin(result.data.admin)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  if (admin) return (
    <Layout>
      <div className="max-w-prose px-8 my-16 rounded-lg pb-8 bg-blend-darken backdrop-blur-3xl" style={{background: '#ffffffbb'}}>
        <h3>VaHI is now ready for use</h3>
        <p>
          Below are the credentials of the root admin account. Please write them down.
        </p>
        <ul>
          <li><strong>Username:</strong><span className="pl-4"> {admin.email}</span></li>
          <li><strong>Password:</strong><span className="pl-4"> {admin.password}</span></li>
        </ul>
        <Link href="/admin">
          <button className="btn btn-primary btn-lg w-full mt-8">To the admin login page</button>
        </Link>
      </div>
    </Layout>
  )

  let happy = true
  if (status?.valid) {
    for (const [key, val] of Object.entries(status.valid)) {
      if (!val[0]) happy = false
    }
  } else happy = false

  if (status.status !== 'green') return (
    <Layout>
      <div className="max-w-prose px-8 my-16 rounded-lg pb-8 bg-blend-darken backdrop-blur-3xl" style={{background: '#ffffffbb'}}>
        <h3>VaHI needs to be initialized</h3>
        <p>
          Before we start, we need to setup your database.  
          <br />
          To do so, we need the following:
        </p>
        <table className="my-4 w-full">
          <tbody>
          {status?.valid
            ? Object.keys(status.valid).map(name => (
              <tr key={name}>
                <td className="pr-4 py-4 border-y"><span role="img" className='text-xl'>{status.valid[name][0] ? '✅' : '❌'}</span></td>
                <td className='pr-4 py-4 font-bold text-xl border-y'>{name}</td>
                <td className="pr-4 py-4 border-y"><span>{status.valid[name][1]}</span></td>
              </tr>
            ))
            : null
          }
          </tbody>
        </table>
        {happy 
          ? (
            <button className="btn btn-primary btn-lg w-full mt-8" onClick={start}>Let's gooooo</button>
          ) : (
            <p>You need to resolve the issues marked with <span role="img" className='text-xl'>❌</span> before we can continue</p>
          )
        }
      </div>
    </Layout>
  ) 

  return <Layout><h5 className='mt-16 text-white opacity-80 font-normal'>VaHI is ready</h5></Layout>
}

export default StartPage

