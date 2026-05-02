import { useId } from 'react'

interface LogoProps {
  size?: number
  textColor?: string
  showText?: boolean
  className?: string
}

export default function Logo({ size = 28, textColor = 'text-slate-900', showText = true, className = '' }: LogoProps) {
  const uid = useId()
  const maskId = `ep-mask-${uid}`
  const clipId = `ep-clip-${uid}`

  const r = size / 2
  const gap = r * 0.55
  const cx1 = r
  const cx2 = r + gap + r
  const totalW = cx2 + r

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={totalW} height={size} viewBox={`0 0 ${totalW} ${size}`} fill="none">
        <defs>
          <mask id={maskId}>
            <rect width={totalW} height={size} fill="white" />
            <circle cx={cx1} cy={r} r={r} fill="black" />
          </mask>
          <clipPath id={clipId}>
            <circle cx={cx1} cy={r} r={r} />
          </clipPath>
        </defs>
        {/* Left circle — blue */}
        <circle cx={cx1} cy={r} r={r} fill="#1B3A6B" />
        {/* Right circle — teal (non-overlap only) */}
        <circle cx={cx2} cy={r} r={r} fill="#0DAF87" mask={`url(#${maskId})`} />
        {/* Intersection — blend */}
        <circle cx={cx2} cy={r} r={r} fill="#0d6e6e" clipPath={`url(#${clipId})`} />
      </svg>

      {showText && (
        <span className={`font-bold tracking-tight ${textColor}`} style={{ fontSize: size * 0.64 }}>
          EuroPay
        </span>
      )}
    </div>
  )
}
