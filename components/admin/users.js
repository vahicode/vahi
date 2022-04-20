import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import AdminIcon from 'components/icons/database.js'
import DisableIcon from 'components/icons/disable.js'
import EnableIcon from 'components/icons/enable.js'
import axios from 'axios'

const updateSelected = (selected, setSelected, id) => {
  const newSelection = {...selected}
  if (selected[id]) delete newSelection[id]
  else newSelection[id] = true

  return setSelected(newSelection)
}

const toggleAllSelected = (allSelected, setSelected, users) => {
  const newSelection = {}
  if (!allSelected) {
    for (const user of users) newSelection[user.id] = true
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
      <span>{t("administration")}: {Object.keys(selected).length} {t('users')}</span>
    </div>
    <ul tabIndex="0" className="dropdown-content menu w-80 rounded-box bg-base-100 p-2 shadow">
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.activateUsers}
        >
          <EnableIcon className="w-6 h-6 text-success" />
          <span className="text-base-content font-bold uppercase">{t('enable')}</span>
        </button>
      </li>
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.deactivateUsers}
        >
          <DisableIcon className="w-6 h-6 text-error" />
          <span className="text-base-content font-bold uppercase">{t('disable')}</span>
        </button>
      </li>
    </ul>
  </div>
)

const Users = ({ users=[], app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [selected, setSelected ] = useState({})

  const someSelected = Object.keys(selected).length < 1 ? false : true
  const allSelected = Object.keys(selected).length === users.length ? true : false

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    activateUsers: users => {
      axios.post(
        '/api/activate-users',
        { users: Object.keys(selected) },
        app.bearer()
      ).then(refresh)
    },
    deactivateUsers: users => {
      axios.post(
        '/api/deactivate-users',
        { users: Object.keys(selected) },
        app.bearer()
      ).then(refresh)
    }
  }


  const ToggleButton = ({ id, children }) => (
    <button className='w-full text-left' 
      onClick={() => updateSelected(selected, setSelected, id)}>
      {children}
    </button>
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
                onChange={() => toggleAllSelected(allSelected, setSelected, users)}
              />
            </th>
            <th>#</th>
            <th>{t('vahi:inviteCode')}</th>
            <th>{t('notes')}</th>
            <th>{t('created')}</th>
            <th>{t('by')}</th>
            <th>{t('lastLogin')}</th>
            <th>{t('enabled')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user,i) => (
            <tr key={user.id} className={`
              ${user.isActive ? '' : 'text-error'}
              ${user.isDemoUser ? 'text-success' : ''}
              ${selected[user.id] ? 'font-bold' : ''}
              hover:pointer
            `}>
              <td><CheckBox {...{id: user.id, selected, setSelected}}/></td>
              <td><ToggleButton id={user.id}>{i}</ToggleButton></td>
              <td><ToggleButton id={user.id}>{user.id}</ToggleButton></td>
              <td><ToggleButton id={user.id}>{user.notes ? user.notes : '-'}</ToggleButton></td>
              <td><ToggleButton id={user.id}><TimeAgo date={user.createdAt} /></ToggleButton></td>
              <td>{user.createdBy}</td>
              <td>{user.lastLogin ? <TimeAgo date={user.lastLogin} /> : '-' }</td>
              <td>
                <ToggleButton id={user.id}>
                  {user.isActive 
                    ? <EnableIcon className="w-6 h-6 text-success" />
                    : <DisableIcon className="w-6 h-6 text-error" />
                  }
                </ToggleButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  )
}

export default Users
