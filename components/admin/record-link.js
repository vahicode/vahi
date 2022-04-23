import Link from 'next/link'

const RecordLink = ({ type='users', id }) => (
  <Link href={`/admin/${type}/${id}`}>
    <a className='text-secondary hover:underline hover:cursor-pointer'>
      {id}
    </a>
  </Link>
)

export default RecordLink

