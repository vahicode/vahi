import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import RightIcon from 'components/icons/right.js'
import ClearIcon from 'components/icons/close.js'
import axios from 'axios'
import Spinner from 'components/spinner.js'
import Grid from 'components/grid.js'
import markdown from 'markdown/finish.mjs'
import Markdown from 'react-markdown'
import { useRouter } from 'next/router'

// Some defaults
const steps = ['vascularity', 'haze', 'integrity']
const defaultGrading = 0
const defaultGradings = {}
for (const step of steps) {
  defaultGradings[step] = {}
  for (let i=1; i<14; i++) defaultGradings[step][i] = defaultGrading
}

const Progress = ({ step, stats }) => {
  const { t } = useTranslation(['vahi'])

  return (
    <div className="flex flex-row flex-wrap justify-around py-4">
      <div className="flex flex-col">
        <label>{t('progressOnThisEye')}</label>
        <ul className="steps">
          {steps.map((s,i) => <li 
            key={s}
            className={`step ${step >= i ? 'step-primary' : ''} after:font-bold`} 
            data-content={t(s).slice(0,1)}
          >{t(s)}</li>
          )}
        </ul>
      </div>
      <div className="flex flex-col items-start sm:w-full md:w-1/2">
        <label className="text-right w-full mb-4">{t('overallProgress')}</label>
        <progress className="progress progress-primary w-full" value={stats.total/100 * stats.done +2} max="104"></progress>
        <label className="text-right w-full mt-4">{stats?.done}/{stats?.total} {t('eyes')}</label>
      </div>
    </div>
  )
}

const Continue = ({ step, stepDone, clear }) => {
  const { t } = useTranslation(['vahi'])
  let cur = 'integrity'
  let next = 'nextEye'
  if (step === 0) {
    cur = 'vascularity'
    next = 'haze'
  }
  else if (step === 1) {
    cur = 'haze'
    next = 'integrity'
  }

  return (
    <div className="text-right flex flex-row items-center justify-end gap-4">
       <button onClick={clear}
        className={`btn btn-primary btn-ghost`}
    >
         <ClearIcon className="w-4 h-4 mr-4" />
         {t('clearIt', { it: t(cur) })}
       </button>
       <button onClick={stepDone}
        className={`btn btn-primary ${step < 2 ? 'btn-outline' : ''}`}
    >
         {t('gradeIt', { it: t(next) })}
         <RightIcon className="w-4 h-4 ml-4" />
       </button>
    </div>
  )
}

const Legend = ({ step }) => {
  const { t } = useTranslation(['vahi'])
  const classes = [
      'bg-green-400 text-green-900',
      'bg-yellow-400 text-yellow-900',
      'bg-orange-500 text-orange-50',
      'bg-red-500 text-red-50',
  ]

  return (
    <div>
      <h3 className="inline-block">{t('legend')}</h3>
      <ul className="border-l-4 pl-4 py-2">
        {[0,1,2,3].map(score => (
          <li key={score+step}>
          <div className={`badge badge-md mr-2 text-slate-50 font-bold ${classes[score]}`}>{score}</div>
            <span>{t(`legend-${steps[step].slice(0,1)}-${score}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


const Grade = ({ app }) => {
  const { t } = useTranslation(['vahi', 'errors'])
  const router = useRouter()
  const lang = router.locale || 'en'

  const [grades, setGrades] = useState(defaultGradings)
  const [flash, setFlash] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState(false)
  const [eye, setEye] = useState(false)
  const [stats, setStats] = useState({done: 0, todo: 0, total: 0})
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    try {
      const result = await axios.get('/api/grading/load', app.bearer(false))
      if (result.data) {
        setStats(result.data.stats)
        setEye(result.data.eye)
      }
      setLoading(false)
    }
    catch (err) {
      setLoading(false)
    }
  }, [])

  const grade = zone => {
    // Grades (stores the results)
    const newGrades = {}
    for (const s of steps) newGrades[s] = {...grades[s]}
    const score = newGrades[steps[step]][zone]
    if (score === 3) newGrades[steps[step]][zone] = 0
    else newGrades[steps[step]][zone] = score+1
    setGrades(newGrades)
    // Flash (provides visual feedback)
    setFlash(true)
    if (window) window.setTimeout(function(){
        setFlash(false)
    }, 700);
  }

  const submit = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        '/api/grading/save', 
        { eye: eye.id, grades },
        app.bearer(false)
      )
      if (result.data) {
        setGrades(defaultGrades)
        setEye(result.data.eye)
        setLoading(false)
      }
      setLoading(false)
    }
    catch (err) {
      setLoading(false)
    }

    console.log('submitting this')
  }

  const clear = () => {
    const newGrades = {}
    for (const s of steps) newGrades[s] = {...grades[s]}
    for (const i=1;i<14;i++) newGrades[steps[step]][i] = 0
    setGrades(newGrades)
  }

  const stepDone = () => {
    if (step === 2) submit()
    else setStep(step+1)
  }

  if (stats.total < 1) {
    if (stats.total === 0) { 
      // no eyes
      return <p>no eyes</p>
    }
    return <p>your done</p>
  }

  if (loading) return <Spinner />

  if (stats.total > 0 && stats.total === stats.done) {
    return (
      <div className="max-w-prose px-8">
        <Markdown>{markdown[lang]}</Markdown>
      </div>
    )
  }

  return (
    <div>
      <Continue step={step} stepDone={stepDone} clear={clear}/>
      <Progress step={step} stats={stats}/>
      <Grid eye={eye} grades={grades[steps[step]]} grade={grade} className={flash ? 'flash' : ''}/>
      <Progress step={step} stats={stats}/>
      <Continue step={step} stepDone={stepDone} clear={clear}/>
      <Legend step={step} />
    </div>
  )
}

export default Grade
