import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import AdminIcon from 'components/icons/database.js'
import DisableIcon from 'components/icons/disable.js'
import EnableIcon from 'components/icons/enable.js'
import axios from 'axios'
import Link from 'next/link'
import Popout from 'components/popout'
import Grid from 'components/grid'

const EyeStats = ({ eye, t, handlers }) => (
  <div className="stats stats-vertical lg:stats-horizontal shadow">
    <div className="stat">
      <div className="stat-title">ID</div>
      <div className="stat-value">{eye.id}</div>
    </div>
    <div className="stat">
      <div className="stat-title">
        {t('createdBy')}
        <span className="px-2">|</span> 
        <TimeAgo date={eye.createdAt} />
      </div>
      <div className="stat-value">{eye.createdBy}</div>
    </div>
    {['scale', 'x', 'y', 'width', 'height'].map(field => (
      <div className="stat" key={field}>
        <div className="stat-title capitalize">{t(field)}</div>
        <div className="stat-value">{eye[field]}</div>
      </div>
    ))}
    <div className="stat">
      <div className="stat-title">Type</div>
      <div className="stat-value">{eye.mimetype}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('enabled')}</div>
      <div className="stat-value">{eye.isActive
        ? <EnableIcon className='text-success w-12 h-12'/>
        : <DisableIcon className='text-error w-12 h-12'/>
      }</div>
    </div>
  </div>
)

const EyeCalibration = ({ eye, t, handlers }) => {
  const [scale, setScale] = useState(eye.scale)
  const [x, setX] = useState(eye.x)
  const [y, setY] = useState(eye.y)

  return (
    <div>
      <h3 className="capitalize">{t('calibration')}</h3>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">{t('scale')} </span>
          <span className="label-text">{scale}</span>
        </label>
        <input type="range" min="20" max="200" value={scale*100} 
          className="range range-sm range-primary" onChange={evt => setScale(evt.target.value/100)}/>

        <label className="label">
          <span className="label-text">X</span>
          <span className="label-text">{x}</span>
        </label>
        <input type="range" min={eye.width * -0.75} max={eye.width * 0.75} value={x} 
          className="range range-sm range-primary" onChange={evt => setX(evt.target.value)}/>

        <label className="label">
          <span className="label-text">Y</span>
          <span className="label-text">{y}</span>
        </label>
        <input type="range" min={eye.height * -0.75} max={eye.height * 0.75} value={y} 
          className="range range-sm range-primary" onChange={evt => setY(evt.target.value)}/>
        <div className="my-4" />
        <Grid eye={{ ...eye, scale, x, y }} inactive />
        <p className="text-center">
          <button className="btn btn-primary w-32" onClick={() => handlers.calibrate({scale, x, y})}>
            {t('save')}
          </button>
        </p>
      </div>
    </div>
  )
}

const EyeNotes = ({ eye, t, handlers }) => {
  const [notes, setNotes] = useState(eye.notes)

  return (
    <div>
      <h3 className="capitalize">{t('notes')}</h3>
      <div className="form-control w-full">
        <textarea rows={8} placeholder={t('notes')} className="input input-bordered w-full h-64 text-lg p-4" 
          onChange={evt => setNotes(evt.target.value)}>
          {notes}
        </textarea>
        <p className="text-center">
          <button className="btn btn-primary w-32" onClick={() => handlers.saveNotes(notes)}>
            {t('save')}
          </button>
        </p>
      </div>

    </div>
  )
}

const EyeAdvanced = ({ eye, t, handlers }) => (
  <>
    <h3 className="capitalize">{t(eye.isActive ? 'disable' : 'enable')}</h3>
    {eye.isActive
      ? (
        <button 
          className="btn btn-error btn-outline"
          onClick={() => handlers.disable()}
        >
          <div className="flex flex-row items-center">
            <DisableIcon/>
            <span className="ml-4">{t('disable')}</span>
          </div>
        </button>
      ) : (
        <button 
          className="btn btn-lg btn-success"
          onClick={() => handlers.enable()}
        >
          <div className="flex flex-row items-center">
            <EnableIcon className="w-10 h-10"/>
            <span className="ml-4">{t('enable')}</span>
          </div>
        </button>
      )}
    {!eye.isActive && (
      <>
        <h3 className="capitalize">{t('delete')}</h3>
        <div className="flex flex-row flex-wrap gap-8 items-center">
          <Popout warning compact>{t('pleaseBeCareful')}</Popout>
          <Popout tip compact><span className="font-normal">{t('noWayBack')}</span></Popout>
          <button className="btn btn-error" onClick={() => handlers.delete(eye.id)}>
            <DisableIcon/>
            <span className="ml-4">{t('delete')}</span>
          </button>
        </div>
      </>
    )}
  </>
)


const Eye = ({ eye, app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [selected, setSelected ] = useState({})

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    saveNotes: notes => {
      axios.post(
        '/api/eyes/notes',
        { eye: eye.id, notes },
        app.bearer()
      ).then(refresh)
    },
    enable: () => {
      axios.post(
        '/api/eyes/activate',
        { eyes: [eye.id] },
        app.bearer()
      ).then(refresh)
    },
    disable: () => {
      axios.post(
        '/api/eyes/deactivate',
        { eyes: [eye.id] },
        app.bearer()
      ).then(refresh)
    },
    calibrate: vals => {
      axios.post(
        '/api/eyes/calibrate',
        { eye: eye.id, ...vals },
        app.bearer()
      ).then(refresh)
    },
    delete: id => {
      axios.delete(
        `/api/eyes/delete/${id}`,
        app.bearer()
      ).then(refresh)
    },
  }

  const pass = { eye, t, handlers }

  return (
    <div>
      <EyeStats {...pass} />
      <EyeCalibration {...pass} />
      <EyeNotes {...pass} />
      <EyeAdvanced {...pass} />
    </div>
  )
}

export default Eye
