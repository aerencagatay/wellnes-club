import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getAllPosts, getPostBySlug } from '@/content'
import { routing, type AppLocale } from '@/i18n/routing'
import { PageHero } from '@/components/layout/page-hero'
import { Section } from '@/components/ui/section'
import { formatDateLong } from '@/lib/utils/dates'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getAllPosts().map((post) => ({ locale, slug: post.slug })))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title[locale], description: post.excerpt[locale] }
}

/**
 * v1'de blog gövdesi düz metin paragraflarından oluşur (bkz. content/posts.ts): tek
 * yaptığı iş `\n\n` ile ayrılmış parçaları `<p>` olarak basmak. İlk gerçek yazı
 * yazıldığında, gerçek Markdown biçimlendirmesi (başlık, liste, kalın metin vb.)
 * gerekiyorsa bu yardımcı bir Markdown kütüphanesiyle değiştirilir — o kararı şimdiden
 * vermek YAGNI'yi ihlal eder, çünkü henüz hangi biçimlendirmenin gerekeceğini
 * bilmiyoruz.
 */
function renderMarkdownBody(body: string): ReactNode[] {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => <p key={index}>{paragraph}</p>)
}

export default async function BlogPostPage({
  params,
}: { params: Promise<{ locale: AppLocale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <PageHero eyebrow={formatDateLong(post.publishedAt, locale)} title={post.title[locale]} />
      <Section size="sm">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">{renderMarkdownBody(post.body[locale])}</div>
      </Section>
    </>
  )
}
