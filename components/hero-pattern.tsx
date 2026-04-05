export function HeroPattern() {
  const rings = (
    cx: number,
    cy: number,
    count: number,
    startR: number,
    step: number,
    baseOpacity: number,
  ) =>
    Array.from({ length: count }, (_, i) => {
      const opacity = Math.max(0.03, baseOpacity - i * 0.022)
      const isAccent = i % 4 === 0
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={startR + i * step}
          fill="none"
          stroke={isAccent ? '#374151' : i % 2 === 0 ? '#6B7280' : '#9CA3AF'}
          strokeWidth={isAccent ? '0.7' : '0.4'}
          opacity={opacity}
        />
      )
    })

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="hero-bounds">
          <rect width="1200" height="600" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-bounds)">
        {rings(880, 295, 17, 45, 58, 0.38)}
        {rings(1170, 55, 13, 32, 52, 0.26)}
        {rings(670, 595, 12, 28, 48, 0.22)}
      </g>
    </svg>
  )
}
