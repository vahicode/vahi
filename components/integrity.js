export const svgSize = 1200

const Integrity = ({ 
  eye, 
  igrade, 
  grade, 
  className='',
}) => {
  // Don't fall over on missing input
  if (!eye.iImg) return null

  const { width, height, id } = eye.iImg
  let { x=0, y=0 } = eye.iImg
  x = x/width
  y = y/height

  const svgViewBox = () => `0 0 ${width} ${height}`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox()} 
      className={`eye shadow rounded-lg ${className}`}
      style={{
        backgroundImage: `url('/api/img/${id}')`,
        backgroundSize: 'contain'
      }}
          >
        <text x={width/2} y={height/2+130} className="integrity"> 
          {igrade}
        </text>
      <path 
        d={`M 2.5,2.5 L ${width-2.5},2.5 L ${width-2.5},${height-5} L 2.5,${height-2.5} z`}
        className={`graded-${igrade}`} 
        onClick={grade}
      />
      ))}
    </svg>
  )
}

export default Integrity
