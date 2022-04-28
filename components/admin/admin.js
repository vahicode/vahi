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
import { useRouter } from 'next/router'

const AdminStats = ({ admin, t, handlers }) => (
  <div className="stats stats-vertical lg:stats-horizontal shadow">
    <div className="stat">
      <div className="stat-title">Email</div>
      <div className="stat-value">{admin.email}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('role')}</div>
      <div className="stat-value capitalize">{admin.role}</div>
    </div>
    <div className="stat">
      <div className="stat-title">
        {t('createdBy')}
        <span className="px-2">|</span> 
        <TimeAgo date={admin.createdAt} />
      </div>
      <div className="stat-value">{admin.createdBy}</div>
    </div>
    <div className="stat">
      <div className="stat-title">{t('enabled')}</div>
      <div className="stat-value">{admin.isActive
        ? <EnableIcon className='text-success w-12 h-12'/>
        : <DisableIcon className='text-error w-12 h-12'/>
      }</div>
    </div>
  </div>
)

const AdminNotes = ({ admin, t, handlers }) => {
  const [notes, setNotes] = useState(admin.notes)

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

const AdminRole = ({ admin, t, handlers }) => {
  const [role, setRole] = useState(admin.role)

  return (
    <div>
      <h3 className="capitalize">{t('role')}</h3>
      <div className="form-control w-full">
        {['dataentry', 'analyst', 'admin', 'superadmin'].map(r => (
          <div className="form-control flex flex-row">
            <label className="label cursor-pointer">
              <input key={r} type="radio" name="role" className="radio" value={r} checked={r === role} onClick={() => setRole(r)}/>
              <span className="label-text ml-4 font-bold uppercase">{r}</span> 
              <span className="label-text ml-4">{t(`roles:${r}`)}</span> 
            </label>
          </div>
        ))}
        {(admin.role === 'superadmin' && role !== 'superadmin')
          ? (
            <Popout warning>
              <h3>{t('noDowngrade')}</h3>
              <p>{t('noDowngradeMsg')}</p>
            </Popout>
          ) : (
            <p className="text-center">
              <button className="btn btn-primary w-32" onClick={() => handlers.saveRole(role)}>
                {t('save')}
              </button>
            </p>
          )
        }
      </div>

    </div>
  )
}

const AdminAdvanced = ({ admin, t, handlers, loggedIn }) => (
  <>
    <h3 className="capitalize">{t(admin.isActive ? 'disable' : 'enable')}</h3>
    {admin.isActive
      ? (loggedIn.email === admin.email)
        ? (
          <Popout tip>
            <h3>{t('noHaraKiri')}</h3>
            <p>{t('noHaraKiriMsg')}</p>
          </Popout>
        ) : (
          <button 
            className="btn btn-error btn-outline"
            onClick={() => handlers.disable()}
          >
            <div className="flex flex-row items-center">
              <DisableIcon/>
              <span className="ml-4">{t('disable')}</span>
            </div>
          </button>
        )
      : (
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
    {!admin.isActive && (
      <>
        <h3 className="capitalize">{t('delete')}</h3>
        <div className="flex flex-row flex-wrap gap-8 items-center">
          <Popout warning compact>{t('pleaseBeCareful')}</Popout>
          <Popout tip compact><span className="font-normal">{t('noWayBack')}</span></Popout>
          <button className="btn btn-error" onClick={() => handlers.delete()}>
            <DisableIcon/>
            <span className="ml-4">{t('delete')}</span>
          </button>
        </div>
      </>
    )}
  </>
)


const Admin = ({ admin, app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi', 'roles'])
  const router = useRouter()

  const [selected, setSelected ] = useState({})

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    saveNotes: notes => {
      axios.put(
        '/api/admins/notes',
        { admin: admin.email, notes },
        app.bearer()
      ).then(refresh)
    },
    saveRole: role => {
      axios.put(
        '/api/admins/role',
        { admin: admin.email, role },
        app.bearer()
      ).then(refresh)
    },
    enable: () => {
      axios.put(
        '/api/admins/activate',
        { admins: [admin.email] },
        app.bearer()
      ).then(refresh)
    },
    disable: () => {
      axios.put(
        '/api/admins/deactivate',
        { admins: [admin.email] },
        app.bearer()
      ).then(refresh)
    },
    delete: () => {
      axios.delete(
        `/api/admins/delete/${admin.email}`,
        app.bearer()
      ).then(router.push(`/admin/admins`))
    },
  }

  const pass = { admin, t, handlers }

  return (
    <div>
      <AdminStats {...pass} />
      <AdminNotes {...pass} />
      <AdminRole {...pass} loggedIn={app.admin}/>
      <AdminAdvanced {...pass} loggedIn={app.admin}/>
    </div>
  )
}

export default Admin
