import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'
import { formatDateLong } from '@/lib/utils/dates'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('blog.title'),
    description: t('blog.description'),
    alternates: buildAlternates(`/${locale}/blog`),
  }
}

export default async function BlogPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const posts = getAllPosts()

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} />
      <Section size="sm">
        {posts.length === 0 ? (
          <div className="max-w-xl">
            <p className="type-lede">{t('empty')}</p>
            <Button className="mt-6" href="/kamplar" variant="ghost">
              {t('emptyCta')}
            </Button>
          </div>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link className="group block" href={`/blog/${post.slug}`}>
                  <div className="relative aspect-3/2 overflow-hidden rounded-md">
                    <Image
                      alt={post.title[locale]}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      src={post.coverImage}
                    />
                  </div>
                  <p className="mt-4 text-xs tracking-widest text-muted uppercase">
                    {formatDateLong(post.publishedAt, locale)}
                  </p>
                  <h3 className="mt-2 font-heading text-xl text-text group-hover:text-olive">
                    {post.title[locale]}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm">{post.excerpt[locale]}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
