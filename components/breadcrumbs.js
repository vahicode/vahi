import Link from 'next/link'

const Crumb = ({ url, title }) => (
  [
    <li key={url}>
      <Link href={url}>
        <a title={title} className="font-bold text-secondary hover:underline hover:cursor-pointer">{title}</a>
      </Link>
    </li>,
    <li>&raquo;</li>
  ]
)

const home = { url: '/', title: 'VaHI' }

const BreadCrumbs = ({ crumbs=[], title='' } ) => (
  <ul className="flex flex-row flex-wrap gap-4">
    {[home, ...crumbs].map(crumb => <Crumb {...crumb} key={crumb.url} />)}
    <li className='font-bold'>{title}</li>
  </ul>
)

export default BreadCrumbs
