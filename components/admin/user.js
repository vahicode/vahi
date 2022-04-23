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

const UserStats = ({ user, t, handlers }) => (
  <div className="stats stats-vertical lg:stats-horizontal shadow">
    <div className="stat">
      <div className="stat-title">{t('vahi:inviteCode')}</div>
      <div className="stat-value">{user.shortId}...</div>
      <div className="stat-desc">{user.id}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('createdBy')}</div>
      <div className="stat-value">{user.createdBy}</div>
      <div className="stat-desc"><TimeAgo date={user.createdAt} /></div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('demoUser')}</div>
      <div className="stat-value capitalize">{user.isDemoUser
        ? <EnableIcon className='text-success w-12 h-12'/>
        : <DisableIcon className='text-error w-12 h-12'/>
      }</div>
      <div className="stat-desc">{t(user.isDemoUser ? 'yes' : 'no')}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('enabled')}</div>
      <div className="stat-value">{user.isActive
        ? <EnableIcon className='text-success w-12 h-12'/>
        : <DisableIcon className='text-error w-12 h-12'/>
      }</div>
      <div className="stat-desc">{t(user.isActive ? 'yes' : 'no')}</div>
    </div>
  </div>
)

const UserNotes = ({ user, t, handlers }) => {
  const [notes, setNotes] = useState(user.notes)

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

const UserAdvanced = ({ user, t, handlers, loggedIn }) => (
  <>
    <h3 className="capitalize">{t(user.isActive ? 'disable' : 'enable')}</h3>
    {user.isActive
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
    {!user.isActive && (
      <>
        <h3 className="capitalize">{t('delete')}</h3>
        <div className="flex flex-row flex-wrap gap-8 items-center">
          <Popout warning compact>{t('pleaseBeCareful')}</Popout>
          <Popout tip compact><span className="font-normal">{t('noWayBack')}</span></Popout>
          <button className="btn btn-error" onClick={() => handlers.delete(user.id)}>
            <DisableIcon/>
            <span className="ml-4">{t('delete')}</span>
          </button>
        </div>
      </>
    )}
  </>
)


const User = ({ user, app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [selected, setSelected ] = useState({})

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    saveNotes: notes => {
      axios.post(
        '/api/users/notes',
        { user: user.id, notes },
        app.bearer()
      ).then(refresh)
    },
    saveRole: role => {
      axios.post(
        '/api/users/role',
        { user: user.id, role },
        app.bearer()
      ).then(refresh)
    },
    enable: () => {
      axios.post(
        '/api/users/activate',
        { users: [user.id] },
        app.bearer()
      ).then(refresh)
    },
    disable: () => {
      axios.post(
        '/api/users/deactivate',
        { users: [user.id] },
        app.bearer()
      ).then(refresh)
    },
    delete: id => {
      axios.delete(
        `/api/users/delete/${id}`,
        app.bearer()
      ).then(refresh)
    },
  }

  const pass = { user, t, handlers }

  return (
    <div>
      <UserStats {...pass} />
      <UserNotes {...pass} />
      <UserAdvanced {...pass}/>
    </div>
  )
}

export default User