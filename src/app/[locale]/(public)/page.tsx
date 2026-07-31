import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
  return (
    <section className="section-py container-page">
      <span className="eyebrow">{t('eyebrow')}</span>
      <h1 className="type-display">{t('heroTitle')}</h1>
      <p className="type-lede mt-6 max-w-2xl">{t('heroLede')}</p>
    </section>
  )
}
