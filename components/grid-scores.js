import { svgSize, paths, text } from './grid.js'

const GridScores = ({ grade, type='v' }) => {

  const { scale, width, height, id } = grade.eye
  let { x=0, y=0 } = grade.eye
  x = x/width
  y = y/height

  const svgViewBox = () => {
    const base = svgSize / scale 
    const ratio = width/height
     
    return (base * x * -1)+' '+(base / ratio * y * -1)+' '+(base)+' '+(base / ratio)
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox()} 
      className={`eye shadow rounded-lg scores`}
      style={{
        backgroundImage: `url('/api/img/${id}')`,
        backgroundSize: 'contain'
      }}
          >
      {Object.keys(text).map(tid => (
        <text key={tid} x={text[tid].x} y={text[tid].y}> 
          {grade[`${type}${tid}`]}
        </text>
      ))}
      {Object.keys(paths).map(pid => (
        <path 
          key={pid} 
          d={paths[pid]} 
          className={`graded-${grade[`${type}${pid}`]}`} 
        />
      ))}
      <circle 
        cx="600" 
        cy="600" 
        r="200" 
        className={`graded-${grade[`${type}13`]}`} 
      />
    </svg>
  )
}

export default GridScores
