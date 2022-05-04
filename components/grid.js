export const svgSize = 1200
export const paths = {
  1:  "m 600,0 0,200 A 400,400 0 0 1 882.66,317.334 L 1024.264,175.736 A 600,600 0 0 0 600,0 Z",
  2:  "M 1024.264,175.736 882.666,317.334 A 400,400 0 0 1 1000,600 l 200,0 A 600,600 0 0 0 1024.264,175.736 Z",
  3:  "m 1000,600 a 400,400 0 0 1 -117.334,282.668 L 1024.264,1024.266 A 600,600 0 0 0 1200,600 l -200,0 z",
  4:  "M 882.666,882.668 A 400,400 0 0 1 600,1000 L 600,1200 a 600,600 0 0 0 424.264,-175.734 L 882.666,882.668 Z",
  5:  "M 317.33398,882.668 175.736,1024.266 A 600,600 0 0 0 600,1200 l 0,-200 a 400,400 0 0 1 -282.666,-117.332 z",
  6:  "M 0,600 A 600,600 0 0 0 175.736,1024.266 L 317.334,882.668 A 400,400 0 0 1 200,600 l -200,0 z",
  7:  "M 175.736,175.736 A 600,600 0 0 0 0,600 L 200,600 A 400,400 0 0 1 317.334,317.334 L 175.736,175.736 Z",
  8:  "M 600,0 A 600,600 0 0 0 175.736,175.736 L 317.334,317.334 A 400,400 0 0 1 600,200 L 600,0 Z",
  9:  "m 458.579,458.58 a 200,200 0 0 1 282.843,0 L 882.843,317.158 a 400,400 0 0 0 -565.685,0 l 141.421,141.421 z",
  10: "m 741.421,458.58 a 200,200 0 0 1 0,282.843 l 141.421,141.421 a 400,400 0 0 0 0,-565.685 L 741.421,458.58 Z",
  11: "m 741.422,741.422 a 200,200 0 0 1 -282.843,0 l -141.421,141.421 a 400,400 0 0 0 565.685,0 L 741.422,741.422 Z",
  12: "m 458.579,741.422 a 200,200 0 0 1 0,-282.843 L 317.157,317.158 a 400,400 0 0 0 0,565.685 l 141.421,-141.421 z"
}
export const text = {
  1:  { x:  770, y:  180 },
  2:  { x: 1070, y:  450 },
  3:  { x: 1070, y:  810 },
  4:  { x:  770, y: 1100 },
  5:  { x:  420, y: 1100 },
  6:  { x:  140, y:  810 },
  7:  { x:  140, y:  450 },
  8:  { x:  440, y:  180 },
  9:  { x:  600, y:  340 },
  10: { x:  890, y:  630 },
  11: { x:  600, y:  940 },
  12: { x:  300, y:  630 },
  13: { x:  600, y:  630 }
}

const Grid = ({ 
  eye, 
  inactive=false, 
  bold=false, 
  grades, 
  grade, 
  className=''
}) => {
  // Don't fall over on missing input
  if (!eye.vImg) return null

  const { scale, width, height, id } = eye.vImg
  let { x=0, y=0 } = eye.vImg
  x = x/width
  y = y/height

  const svgViewBox = () => {
    const base = svgSize / scale 
    const ratio = width/height
     
    return (base * x * -1)+' '+(base / ratio * y * -1)+' '+(base)+' '+(base / ratio)
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox()} 
      className={`eye shadow rounded-lg ${bold ? 'bold' : ''} ${eye.isActive ? 'active' : 'inactive'} ${className}`}
      style={{
        backgroundImage: `url('/api/img/${id}')`,
        backgroundSize: 'contain'
      }}
          >
      {!inactive && Object.keys(text).map(tid => (
        <text key={tid} x={text[tid].x} y={text[tid].y}> 
          {grades[tid]}
        </text>
      ))}
      {Object.keys(paths).map(pid => (
        <path 
          key={pid} 
          d={paths[pid]} 
          className={inactive ? '' : `graded-${grades[pid]}`} 
          onClick={inactive ? null : () => grade(pid)}
        />
      ))}
      <circle 
        cx="600" 
        cy="600" 
        r="200" 
        className={inactive ? '' : `graded-${grades['13']}`} 
        onClick={inactive ? null : () => grade(13)}
      />
    </svg>
  )
}

export default Grid
