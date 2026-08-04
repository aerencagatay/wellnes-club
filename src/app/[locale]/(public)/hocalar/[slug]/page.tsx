import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAllTeachers, getCampsForTeacher, getTeacherBySlug } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { CampCard } from '@/components/camps/camp-card'
import { TeacherBio } from '@/components/teachers/teacher-bio'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllTeachers().map((teacher) => ({ locale, slug: teacher.slug })),
  )
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  const teacher = getTeacherBySlug(slug)
  if (!teacher) return {}
  return {
    title: `${teacher.name} — ${teacher.title[locale]}`,
    description: teacher.bio[locale].slice(0, 155),
    alternates: buildAlternates(`/${locale}/hocalar/${slug}`),
  }
}

export default async function TeacherPage({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const teacher = getTeacherBySlug(slug)
  if (!teacher) notFound()

  const camps = getCampsForTeacher(teacher.slug)
  const t = await getTranslations('teachers')

  return (
    <>
      <Section>
        <TeacherBio locale={locale} teacher={teacher} />
      </Section>
      {camps.length > 0 && (
        <Section background="surface">
          <h2 className="type-title">{t('campsWithTeacher', { name: teacher.name })}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {camps.map((camp) => (
              <CampCard camp={camp} key={camp.slug} locale={locale} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
