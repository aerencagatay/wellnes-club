import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllTeachers } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { TeacherCard } from '@/components/teachers/teacher-card'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'
import { cn } from '@/lib/utils/cn'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('hocalar.title'),
    description: t('hocalar.description'),
    alternates: buildAlternates(`/${locale}/hocalar`),
  }
}

export default async function TeachersPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('teachers')
  const teachers = getAllTeachers()

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      <Section size="sm">
        {/* `sm:grid-cols-2`: `TeacherCard`'ın kaydırılmış (asimetrik) çift-sıra
            ofseti `sm:` kesme noktasından itibaren devreye girer (bkz.
            teacher-card.tsx). Izgara sütun sayısı da aynı kesme noktasında
            değişmezse tek sütunlu mobil görünümde gereksiz bir dikey boşluk
            oluşur — bu yüzden burada `md:` değil `sm:` kullanılır. */}
        <div className={cn('grid gap-10', teachers.length > 1 && 'sm:grid-cols-2 lg:grid-cols-3', teachers.length === 1 && 'max-w-xs')}>
          {teachers.map((teacher) => (
            // Bu grid, sayfanın h1'inden (PageHero) sonra ara bir h2 bölüm başlığı
            // olmadan geliyor — h3 verirsek başlık seviyesi h1 → h3 atlar.
            <TeacherCard headingLevel="h2" key={teacher.slug} locale={locale} teacher={teacher} />
          ))}
        </div>
      </Section>
    </>
  )
}
