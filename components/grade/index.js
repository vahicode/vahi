import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import RightIcon from 'components/icons/right.js'

// Some defaults
const defaultGrading = 0
const defaultGradings = {}
for (let i=1; i<14; i++) defaultGradings[i] = defaultGrading
const steps = ['vascularity', 'haze', 'integrity']

const Progress = ({ step }) => {
  const { t } = useTranslation(['vahi'])

  return (
    <div className="flex flex-row flex-wrap justify-around pt-4 border-t">
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
        <progress className="progress progress-primary w-full" value="20" max="100"></progress>
        <label className="text-right w-full mt-4">12/34 {t('eyes')}</label>
      </div>
    </div>
  )
}

const Continue = ({ step, done }) => {
  const { t } = useTranslation(['vahi'])
  let next = 'nextEye'
  if (step === 0) next = 'haze'
  else if (step === 1) next = 'integrity'

  return (
    <p className="text-right">
       <button onClick={done}
        className={`btn btn-primary ${step < 2 ? 'btn-outline' : ''}`}
    >
         {t('gradeIt', { it: t(next) })}
         <RightIcon className="w-4 h-4 ml-4" />
       </button>
    </p>
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

  const [grades, setGrades] = useState(defaultGradings)
  const [step, setStep] = useState(0)
  const [error, setError] = useState(false)

  const done = () => {
    if (step === 2) {
      setStep(0)
    }
    else setStep(step+1)
  }

  return (
    <div>
      <Continue step={step} done={done}/>
      <Progress step={step} />
      <Continue step={step} done={done}/>
      <Legend step={step} />
    </div>
  )
}

export default Grade
