import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import AdminIcon from 'components/icons/database.js'
import DisableIcon from 'components/icons/disable.js'
import EnableIcon from 'components/icons/enable.js'
import axios from 'axios'
import Link from 'next/link'
import Grid from 'components/grid'
import RecordLink from 'components/admin/record-link.js'

const updateSelected = (selected, setSelected, id) => {
  const newSelection = {...selected}
  if (selected[id]) delete newSelection[id]
  else newSelection[id] = true

  return setSelected(newSelection)
}

const toggleAllSelected = (allSelected, setSelected, eyes) => {
  const newSelection = {}
  if (!allSelected) {
    for (const eye of eyes) newSelection[eye.id] = true
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
      <span>{t("administration")}: {Object.keys(selected).length} {t('eyes')}</span>
    </div>
    <ul tabIndex="0" className="dropdown-content menu w-80 rounded-box bg-base-100 p-2 shadow">
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.activateEyes}
        >
          <EnableIcon className="w-6 h-6 text-success" />
          <span className="text-base-content font-bold uppercase">{t('enable')}</span>
        </button>
      </li>
      <li>
        <button className="btn-ghost hover:bg-base-200 text-base-content flex flex-row gap-4"
          onClick={handlers.deactivateEyes}
        >
          <DisableIcon className="w-6 h-6 text-error" />
          <span className="text-base-content font-bold uppercase">{t('disable')}</span>
        </button>
      </li>
    </ul>
  </div>
)

const Eyes = ({ eyes=[], app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  const [selected, setSelected ] = useState({})

  const someSelected = Object.keys(selected).length < 1 ? false : true
  const allSelected = Object.keys(selected).length === eyes.length ? true : false

  const refresh = () => setUpdate(Date.now())

  const handlers = {
    activateEyes: (eyes=false) => {
      axios.put(
        '/api/eyes/activate',
        { eyes: eyes ? eyes : Object.keys(selected) },
        app.bearer()
      ).then(refresh)
    },
    deactivateEyes: (eyes=false) => {
      axios.put(
        '/api/eyes/deactivate',
        { eyes: eyes ? eyes : Object.keys(selected) },
        app.bearer()
      ).then(refresh)
    }
  }

  const toggleActive = eye => eye.isActive
    ? handlers.deactivateEyes([eye.id])
    : handlers.activateEyes([eye.id])

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
                onChange={() => toggleAllSelected(allSelected, setSelected, eyes)}
              />
            </th>
            <th>#</th>
            <th className="w-36">-</th>
            <th>ID</th>
            <th>{t('graded')}</th>
            <th>{t('notes')}</th>
            <th>{t('created')}</th>
            <th>{t('by')}</th>
            <th>{t('enabled')}</th>
          </tr>
        </thead>
        <tbody>
          {eyes.map((eye,i) => (
            <tr key={eye.id} className={`
              ${eye.isActive ? '' : 'text-error opacity-50'}
              ${selected[eye.id] ? 'font-bold' : ''}
              hover:pointer
            `}>
              <td><CheckBox {...{id: eye.id, selected, setSelected}}/></td>
              <td><ToggleButton id={eye.id}>{(i + 1)}</ToggleButton></td>
              <td>
                <Link href={`/admin/eyes/${eye.id}`}>
                  <a> 
                    <Grid eye={eye} inactive bold />
                  </a>
                </Link>
              </td>
              <td><RecordLink id={eye.id} type='eyes'/></td>
              <td><ToggleButton id={eye.id}>{eye?.graded}</ToggleButton></td>
              <td><ToggleButton id={eye.id}>{eye.notes ? eye.notes : '-'}</ToggleButton></td>
              <td><ToggleButton id={eye.id}><TimeAgo date={eye.createdAt} /></ToggleButton></td>
              <td><RecordLink id={eye.createdBy} type='admins'/></td>
              <td>
                <button onClick={() => toggleActive(eye)}>
                  {eye.isActive 
                    ? <EnableIcon className="w-6 h-6 text-success" />
                    : <DisableIcon className="w-6 h-6 text-error" />
                  }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  )
}

export default Eyes
