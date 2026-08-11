/** lucide-react marka ikonları taşımıyor — tek kullanım yeri burası olduğu için yerel bir çizgi ikon yeterli. */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect height="18" rx="5" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
