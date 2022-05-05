import { svgSize, paths, text } from './grid.js'

const IntegrityScores = ({ grade }) => {

  const { width, height, id } = grade.eye.iImg
  let { x=0, y=0 } = grade.eye.vImg
  x = x/width
  y = y/height

  const svgViewBox = () => `0 0 ${width} ${height}`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox()} 
      className={`eye shadow rounded-lg scores`}
      style={{
        backgroundImage: `url('/api/img/${id}')`,
        backgroundSize: 'contain'
      }}
    >
      <text x={width/2} y={height/2+130} className="integrity"> 
        {grade.i}
      </text>
      <path 
        d={`M 2.5,2.5 L ${width-2.5},2.5 L ${width-2.5},${height-5} L 2.5,${height-2.5} z`}
        className={`graded-${grade.i}`} 
      />
    </svg>
  )
}

export default IntegrityScores
