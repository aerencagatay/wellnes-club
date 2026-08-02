import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllTeachers } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { TeacherCard } from '@/components/teachers/teacher-card'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

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
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.slug} locale={locale} teacher={teacher} />
          ))}
        </div>
      </Section>
    </>
  )
}
