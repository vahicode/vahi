import { useTranslation } from 'next-i18next'
import TimeAgo from 'react-timeago'
import AdminIcon from 'components/icons/database.js'
import RecordLink from 'components/admin/record-link.js'
import Link from 'next/link'

/*
const zones = [1,2,3,4,5,6,7,8,9,10,11,12,13]
const types = ['v', 'h', 'i']
const Grade = ({ grade, t }) => [
  <tr key={`meta-${grade.id}`} className="hover:pointer">
    <td colspan="13" className="font-bold text-center">
      <Link href={`/admin/grades/${grade.id}`}>
        <a className="text-secondary hover:cursor-pointer hover:underline">
          {`#${grade.id}`}
        </a>
      </Link>
      <span className="px-2">|</span>
      <Link href={`/admin/grades/${grade.id}`}>
        <a className="text-secondary hover:cursor-pointer hover:underline">
          <TimeAgo date={grade.createdAt} />
        </a>
      </Link>
      <span className="px-2">|</span>
      <Link href={`/admin/users/${grade.user}`}>
        <a className="text-secondary hover:cursor-pointer hover:underline">{grade.user.slice(0,6)}...</a>
      </Link>
    </td>
  </tr>,
  ...types.map(type => (
    <tr key={`${type}-${grade.id}`} className="hover:pointer">
      {zones.map(zone => <td key={zone} className="w-4">{grade[`${type}${zone}`]}</td>)}
    </tr>
  ))
]
*/

const Grades = ({ grades=[], app, setUpdate }) => {
  const { t } = useTranslation(['admin', 'vahi'])

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>{t('vahi:inviteCode')}</th>
            <th>{t('vahi:eyes')} ID</th>
            <th>{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, i) => (
            <tr key={grade.id}>
              <td>{i+1}</td>
              <td><RecordLink id={grade.id} type="grades"/></td>
              <td>
                <Link href={`/admin/users/${grade.userId}`}>
                  <a className="text-secondary hover:cursor-pointer hover:underline">
                    {grade.userId}
                  </a>
                </Link>
              </td>
              <td>
                <Link href={`/admin/eyes/${grade.eyeId}`}>
                  <a className="text-secondary hover:cursor-pointer hover:underline">
                    {grade.eyeId}
                  </a>
                </Link>
              </td>
              <td><TimeAgo date={grade.createdAt}/></td>

            </tr>
          ))}
        </tbody>
      </table>
  </div>
  )
}

export default Grades
