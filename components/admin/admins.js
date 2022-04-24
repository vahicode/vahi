import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import AdminIcon from 'components/icons/database.js'
import DisableIcon from 'components/icons/disable.js'
import EnableIcon from 'components/icons/enable.js'
import axios from 'axios'
import Link from 'next/link'
import Popout from 'components/popout.js'

const updateSelected = (selected, setSelected, id) => {
  const newSelection = {...selected}
  if (selected[id]) delete newSelection[id]
  else newSelection[id] = true

  return setSelected(newSelection)
}

const toggleAllSelected = (allSelected, setSelected, admins) => {
  const newSelection = {}
  if (!allSelected) {
    for (const admin of admins) newSelection[admin.email] = true
  }

  setSelected(newSelection)
}
    
const CheckBox = ({ id, selected, setSelected }) => (
  <input 
    type="checkbox" 
    className="checkbox" 
    checked={selected[id] ? true : false}
    onChange={() => updateSelected(selected, setSelected, id)}
  />
)

const DropDownMenu = ({ t, handlers, selected, someSelected, app }) => (
  <div className={`dropdown my-4
    ${someSelected ? '' : 'opacity-50'}
  `}>
    <div
      tabIndex="0"
      className={`
        ${someSelected ? '' : 'disabled'}
        btn-neutral btn m-0 flex flex-row gap-2
        hover:border-neutral-content
        hover:bg-neutral sm:btn-ghost
      `}
    >
      <AdminIcon className="w-6 h-6 text-success" />
      <span>{t("administration")}: {Object.keys(selected).length} {t('administrators')}</span>
    </div>
    <ul tabIndex="0" className="dropdown-content menu w-80 rounded-box bg-base-100 p-2 shadow">
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.activateAdmins}
        >
          <EnableIcon className="w-6 h-6 text-success" />
          <span className="text-base-content font-bold uppercase">{t('enable')}</span>
        </button>
      </li>
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.deactivateAdmins}
        >
          <DisableIcon className="w-6 h-6 text-error" />
          <span className="text-base-content font-bold uppercase">{t('disable')}</span>
        </button>
      </li>
    </ul>
  </div>
)

const roleClasses = {
  superadmin: 'bg-error text-error-content',
  admin: 'bg-secondary text-secondary-content',
  analyst: 'bg-success text-success-content',
  dataentry: 'bg-info text-info-content',
}

const Admins = ({ admins=[], app, setUpdate, setError }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [selected, setSelected ] = useState({})

  const someSelected = Object.keys(selected).length < 1 ? false : true
  const allSelected = Object.keys(selected).length === admins.length ? true : false

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    activateAdmins: admins => {
      axios.post(
        '/api/admins/activate',
        { admins: Object.keys(selected) },
        app.bearer()
      ).then(() => {
        setError(null)
        refresh()
      })
    },
    deactivateAdmins: admins => {
      axios.post(
        '/api/admins/deactivate',
        { admins: Object.keys(selected) },
        app.bearer()
      ).then(res => {
        if (res.data.danger) setError({ 
          warning: true, 
          msg: `I'm sorry, I'm afraid I can't do that. I will not disable the account you're currently using`
        })
        else setError(null)
        refresh()
      })
    }
  }


  const AdminLink = ({ id, children }) => (
    <Link href={`/admin/admins/${id}`}>
      <a className='w-full text-left'>{children}</a>
    </Link>
  )

  return (
    <div className="overflow-x-auto">
      <DropDownMenu 
        t={t}
        handlers={handlers}
        selected={selected}
        someSelected={someSelected}
      />
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                className="checkbox" 
                checked={allSelected}
                onChange={() => toggleAllSelected(allSelected, setSelected, admins)}
              />
            </th>
            <th>#</th>
            <th>Email</th>
            <th>{t('role')}</th>
            <th>{t('notes')}</th>
            <th>{t('created')}</th>
            <th>{t('by')}</th>
            <th>{t('lastLogin')}</th>
            <th>{t('enabled')}</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin,i) => (
            <tr key={admin.email} className={`
              ${admin.isActive ? '' : 'text-error'}
              ${selected[admin.email] ? 'font-bold' : ''}
              hover:pointer
            `}>
              <td><CheckBox {...{id: admin.email, selected, setSelected}}/></td>
              <td>
                <Link href={`/admin/admins/${admin.email}`.replace('@', '%40')}>
                  <a className={`p-1 px-3 rounded-full
                    ${admin.email === app.admin.email ? 'bg-success text-success-content' : ''}
                  `}>{(i + 1)}</a>
                </Link>
              </td>
              <td><AdminLink id={admin.email}>{admin.email}</AdminLink></td>
              <td>
                <AdminLink id={admin.email}>
                  <span className={`
                    p-1 px-3 uppercase rounded-full font-bold
                    ${admin.isActive ? roleClasses[admin.role] : 'text-base-content opacity-50'}
                    `}>{admin.role}</span>
                </AdminLink>
                </td>
              <td><AdminLink id={admin.email}>{admin.notes ? admin.notes : '-'}</AdminLink></td>
              <td><AdminLink id={admin.email}><TimeAgo date={admin.createdAt} /></AdminLink></td>
              <td>{admin.createdBy}</td>
              <td>{admin.lastLogin ? <TimeAgo date={admin.lastLogin} /> : '-' }</td>
              <td>
                <AdminLink id={admin.email}>
                  {admin.isActive 
                    ? <EnableIcon className="w-6 h-6 text-success" />
                    : <DisableIcon className="w-6 h-6 text-error" />
                  }
                </AdminLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  )
}

export default Admins
