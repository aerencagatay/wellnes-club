import type { CampSession, Level, Program } from '@/content'

/** Tek doğruluk kaynağı: geçerli program/seviye değerleri. `'all'` sentinel'i filtre arayüzünün kendi kaygısıdır, burada yer almaz. */
export const PROGRAMS: readonly Program[] = ['yoga', 'pilates', 'yoga-pilates']
export const LEVELS: readonly Level[] = ['baslangic', 'tum-seviyeler', 'ileri']

/** Bu sayı ve altındaki boş yer "son yerler" uyarısını tetikler. */
export const LAST_SPOTS_THRESHOLD = 4

export type CampBadge = 'closed' | 'waitlist' | 'last-spots' | 'open'

export function getCampBadge(camp: CampSession): CampBadge {
  if (camp.status === 'closed') return 'closed'
  if (camp.status === 'waitlist') return 'waitlist'
  if (camp.spotsLeft === 0) return 'closed'
  if (camp.spotsLeft <= LAST_SPOTS_THRESHOLD) return 'last-spots'
  return 'open'
}

export type CampFilter = {
  program?: Program | 'all'
  level?: Level | 'all'
}

export function filterCamps(camps: CampSession[], filter: CampFilter): CampSession[] {
  return camps.filter((camp) => {
    if (filter.program && filter.program !== 'all' && camp.program !== filter.program) return false
    if (filter.level && filter.level !== 'all' && camp.level !== filter.level) return false
    return true
  })
}
