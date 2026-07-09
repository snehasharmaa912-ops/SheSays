export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="SheSays logo">
      <defs>
        <linearGradient id="shesays-logo-g" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#ff7fb0" />
          <stop offset="55%" stopColor="#ff2d78" />
          <stop offset="100%" stopColor="#8a0f45" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="#0d0d0d" />
      <g fill="url(#shesays-logo-g)">
        <circle cx="35" cy="62" r="11" />
        <path d="M 44 55 C 46 43 40 33 30 27 C 42 30 51 40 49 54 C 48 58 46 59 44 55 Z" />
      </g>
      <g fill="url(#shesays-logo-g)">
        <circle cx="65" cy="62" r="11" />
        <path d="M 74 55 C 76 43 70 33 60 27 C 72 30 81 40 79 54 C 78 58 76 59 74 55 Z" />
      </g>
    </svg>
  )
}
