import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import RightIcon from 'components/icons/right.js'
import ClearIcon from 'components/icons/close.js'
import axios from 'axios'
import Spinner from 'components/spinner.js'
import Grid from 'components/grid.js'
import Integrity from 'components/integrity.js'
import markdown from 'markdown/finish.mjs'
import Markdown from 'react-markdown'
import { useRouter } from 'next/router'
import Popout from 'components/popout'
import config from '../../vahi.config.mjs'

// Some defaults
const steps = []
if (config.grade.v) steps.push('vascularisation')
if (config.grade.h) steps.push('haze')
const defaultGrading = 0
const defaultGradings = {}
for (const step of steps) {
  defaultGradings[step] = {}
  for (let i=1; i<14; i++) defaultGradings[step][i] = defaultGrading
}
if (config.grade.i) steps.push('integrity')
defaultGradings.integrity = 0

const Progress = ({ step, stats, eye }) => {
  const { t } = useTranslation(['vahi'])

  return (
    <div className="flex flex-row flex-wrap justify-around py-4">
      <div className="flex flex-col">
        <label>{t('progressOnThisEye')} (#{eye.id})</label>
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
        <progress className="progress progress-primary w-full" value={(100 / stats.total) * stats.done +2} max="104"></progress>
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
    cur = 'vascularisation'
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
      <h3 className="inline-block">{t('example')}</h3>
      <img src={`/img/legend/${steps[step][0]}.png`} className="w-full" />
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

  const grade = (zone=false) => {
    if (steps[step] === 'integrity') {
      let newGrade = grades.integrity + 1
      if (newGrade > 3) newGrade = 0
      setGrades({...grades, integrity: newGrade })
    } else {
      // Grades (stores the results)
      const newGrades = {}
      for (const s of steps) {
        if (steps[s] !== 'integrity') newGrades[s] = {...grades[s]}
      }
      newGrades.integrity = grades.integrity
      const score = newGrades[steps[step]][zone]
      if (score === 3) newGrades[steps[step]][zone] = 0
      else newGrades[steps[step]][zone] = score+1
      setGrades(newGrades)
    }
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
        setStep(0)
        setEye(result.data.eye)
        setStats(result.data.stats)
        setGrades(defaultGradings)
      }
      setLoading(false)
    }
    catch (err) {
      setLoading(false)
    }
  }

  const clear = () => {
    const newGrades = {...grades}
    if (steps[step] === 'integrity') newGrades.integrity = 0
    else {
      for (const i=1;i<14;i++) newGrades[steps[step]][i] = 0
    }
    setGrades(newGrades)
  }

  const stepDone = () => {
    if (step === 2) submit()
    else setStep(step+1)
  }

  if (stats.total === 0) return (
    <Popout note>
      <h2 className="m-0">{t('noEyesToGrade')}</h2>
      <p className="m-0">{t('noEyesToGradeMsg')}</p>
    </Popout>
  )

  if (loading) return <Spinner />

  if (stats.total > 0 && stats.total === stats.done) {
    return (
      <div className="max-w-prose px-8">
        <Markdown>{markdown[lang]}</Markdown>
      </div>
    )
  }

  return (
    <div className="flex flex-row row-wrap">
      <div className="w-2/3 px-0 lg:px-4">
        <Continue step={step} stepDone={stepDone} clear={clear}/>
        <Progress step={step} stats={stats} eye={eye}/>
        {steps[step][0] === 'i'
          ? <Integrity eye={eye} igrade={grades[steps[step]]} grade={grade} className={flash ? 'flash' : ''}/>
          : <Grid eye={eye} grades={grades[steps[step]]} grade={grade} className={flash ? 'flash' : ''}/>
        }
        <Progress step={step} stats={stats} eye={eye}/>
        <Continue step={step} stepDone={stepDone} clear={clear}/>
      </div>
      <div className="w-1/3 px-0 lg:px-4 pt-4 lg:pt-36">
        <Legend step={step} />
      </div>
    </div>
  )
}

export default Grade
