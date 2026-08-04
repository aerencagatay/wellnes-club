'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Chip } from '@/components/ui/chip'
import type { Level, Program } from '@/content'
import { LEVELS as LEVEL_VALUES, PROGRAMS as PROGRAM_VALUES } from '@/lib/utils/camp-status'

// 'all' sentinel'i yalnızca bu filtre arayüzüne ait; kanonik listeler camp-status'tan gelir.
const PROGRAMS: (Program | 'all')[] = ['all', ...PROGRAM_VALUES]
const LEVELS: (Level | 'all')[] = ['all', ...LEVEL_VALUES]

export function CampFilters() {
  const t = useTranslations('camp')
  const tf = useTranslations('camps.filters')
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const program = params.get('program') ?? 'all'
  const level = params.get('level') ?? 'all'

  function setParam(key: 'program' | 'level', value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mr-2 text-xs tracking-widest text-muted uppercase">{tf('program')}</legend>
        {PROGRAMS.map((value) => (
          <Chip active={program === value} key={value} onClick={() => setParam('program', value)}>
            {value === 'all' ? tf('all') : t(`program.${value}`)}
          </Chip>
        ))}
      </fieldset>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mr-2 text-xs tracking-widest text-muted uppercase">{tf('level')}</legend>
        {LEVELS.map((value) => (
          <Chip active={level === value} key={value} onClick={() => setParam('level', value)}>
            {value === 'all' ? tf('all') : t(`level.${value}`)}
          </Chip>
        ))}
      </fieldset>
    </div>
  )
}
