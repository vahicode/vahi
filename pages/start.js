import { useState, useEffect } from 'react'
import Page from 'components/page.js'
import useApp from 'hooks/useApp.js'
import config from '../vahi.config.mjs'
import axios from 'axios'

const Valid = val => val 
  ? <span role="img">✅</span>
  : <span role="img">❌</span>

const HomePage = (props) => {
  const app = useApp()

  const [status, setStatus] = useState(false)

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

  const start = () => {
    let result
    try {
      axios.post('/api/start')
    }
    catch (err) {
      console.log(err)
    }
  }

  let happy = true
  if (status?.valid) {
    for (const [key, val] of Object.entries(status.valid)) {
      if (!val[0]) happy = false
    }
  } else happy = false

  const shadow = {textShadow: '1px 1px 3px #000', color: 'white' }

  return (
      <div className="mb-20 min-h-screen"
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

          {status.status !== 'green' && (
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
          )}
        </div>
      </div>
  )
}

export default HomePage

