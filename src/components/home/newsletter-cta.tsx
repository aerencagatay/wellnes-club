import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

export function NewsletterCta() {
  const t = useTranslations('home.newsletter')

  return (
    <Section background="cream-3" size="sm">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="type-section-title">{t('title')}</h2>
        <p className="type-lede mt-4">{t('lede')}</p>

        {/*
          Bu form istemci bileşeni DEĞİLDİR ve henüz hiçbir uca gönderim yapmaz.
          Task 13, Task 12'nin oluşturacağı /api/inquiry ucunu ve paylaşılan
          submitInquiry yardımcı fonksiyonunu (kind: 'newsletter' ile) buraya
          bağlayacak. Burada yalnızca işaretleme ve KVKK onay kutusu hazırlanır.
        */}
        <form className="mt-8 flex flex-col items-center gap-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              {t('placeholder')}
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-full border border-border bg-cream px-5 py-3 text-sm text-ink placeholder:text-body focus-visible:border-accent-deep sm:flex-1"
              id="newsletter-email"
              name="email"
              placeholder={t('placeholder')}
              required
              type="email"
            />
            <Button size="md" type="submit" variant="primary">
              {t('submit')}
            </Button>
          </div>
          <label className="flex items-start gap-2 text-left text-xs text-body" htmlFor="newsletter-consent">
            <input className="mt-0.5" id="newsletter-consent" name="consent" required type="checkbox" />
            {t('consent')}
          </label>
        </form>
      </div>
    </Section>
  )
}
