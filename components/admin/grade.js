import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import GridScores from 'components/grid-scores'
import IntegrityScores from 'components/integrity-scores'
import Popout from 'components/popout'

const zones = [1,2,3,4,5,6,7,8,9,10,11,12,13]

const score = (grade, type) => {
  let total = 0
  for (const zone of zones) total += grade[`${type}${zone}`]

  return total
}
const scores = (grade, type) => {
  const scores = []
  for (const zone of zones) scores.push(grade[`${type}${zone}`])
  return scores.join(',')
}

const GradeStats = ({ grade, t }) => (
  <div className="stats stats-vertical lg:stats-horizontal shadow">
    <div className="stat">
      <div className="stat-title">{t('vahi:eyes')} ID</div>
      <div className="stat-value">{grade.userId.slice(0,6)}...</div>
      <div className="stat-desc">{grade.userId}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('vahi:inviteCode')}</div>
      <div className="stat-value">{grade.userId.slice(0,6)}...</div>
      <div className="stat-desc">{grade.userId}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('vahi:vascularisation')}</div>
      <div className="stat-value">{score(grade, 'v')}/39</div>
      <div className="stat-desc">{scores(grade, 'v')}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('vahi:haze')}</div>
      <div className="stat-value">{score(grade, 'h')}/39</div>
      <div className="stat-desc">{scores(grade, 'h')}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('vahi:integrity')}</div>
      <div className="stat-value">{score(grade, 'i')}/39</div>
      <div className="stat-desc">{scores(grade, 'i')}</div>
    </div>
  </div>
)

const Grade = ({ grade, app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [type, setType] = useState('v')

  const pass = { grade, t }

  return (
    <div>
      <GradeStats {...pass} />
      <div className="form-control w-full my-8">
        {['vascularisation', 'haze', 'integrity'].map(tp => (
          <div className="form-control flex flex-row" key={tp}>
            <label className="label cursor-pointer">
              <input 
                type="radio" name="type" className="radio" 
                value={tp} checked={tp.slice(0,1) === type} 
                onClick={() => setType(tp.slice(0,1))}
              />
              <span className="label-text ml-4 font-bold uppercase">{t(`vahi:${tp}`)}</span> 
              <span className="label-text ml-4">{t(`vahi:legend-${tp.slice(0,1)}`)}</span> 
            </label>
          </div>
        ))}
      </div>
      {type === 'i'
        ? <IntegrityScores grade={grade} />
        : <GridScores grade={grade} type={type}/>
      }
      <div className="mt-8">
        <Popout tip compact>{t('hoverReveals')}</Popout>
      </div>
    </div>
  )
}

export default Grade
