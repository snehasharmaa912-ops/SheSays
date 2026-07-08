export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="SheSays logo">
      <circle cx="50" cy="50" r="48" fill="#0d0d0d" />
      <circle cx="50" cy="38" r="16" fill="#ff2d78" />
      <path d="M50 54c-16 0-28 12-28 28v8h56v-8c0-16-12-28-28-28z" fill="#ff2d78" />
      <path d="M34 30c0-10 7-18 16-18s16 8 16 18" stroke="#0d0d0d" strokeWidth="3" fill="none" />
      <circle cx="72" cy="26" r="4" fill="#fff" />
    </svg>
  )
}
