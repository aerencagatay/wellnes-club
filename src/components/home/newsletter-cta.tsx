'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { resolveErrorMessage, submitInquiry } from '@/lib/inquiry-client'

export function NewsletterCta() {
  const t = useTranslations('home.newsletter')
  const te = useTranslations('form.errors')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // `te.has` kontrolü bilinçli — bkz. inquiry-client.ts → resolveErrorMessage: bir
  // anahtar mesaj dosyasında yoksa ham anahtar yerine `generic`'e düşülür.
  function translateError(key: string | undefined): string | undefined {
    return key ? resolveErrorMessage(te, key) : undefined
  }

  const emailError = translateError(errors.email)
  const consentError = translateError(errors.consent)
  const formError = translateError(errors.form)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})

    const data = new FormData(event.currentTarget)
    const result = await submitInquiry({
      kind: 'newsletter',
      email: String(data.get('email') ?? ''),
      // Bkz. inquiry-form.tsx'teki aynı satır: consent zod'da `z.literal(true)`, `boolean`
      // değil. Kutu işaretli değilse `false` göndermek bilinçlidir — sunucu
      // `consentRequired` ile reddeder; cast yalnızca bu tek alana daraltılmıştır.
      consent: (data.get('consent') === 'on') as true,
    })

    if (result.ok) {
      // `submitting` KASITLI olarak burada temizlenmez: önce temizleyip sonra formu
      // teşekkür mesajıyla değiştirmek arada bir an için düğmeyi tekrar tıklanabilir
      // bırakır — hızlı bir ikinci tık organizatöre aynı kaydın ikinci bir e-postasını
      // gönderebilir. Form zaten `subscribed` ile kaldırılacağı için `submitting`'i
      // true bırakmanın hiçbir görsel maliyeti yok.
      setSubscribed(true)
      return
    }

    setSubmitting(false)
    // Form verisi korunur: e-posta alanı denetimsiz (uncontrolled) olduğu için yeniden
    // render, kullanıcının girdiği değeri silmez — yalnızca hata durumu eklenir.
    setErrors(result.errors ?? { form: result.error === 'rate_limited' ? 'rateLimited' : 'generic' })
  }

  return (
    <Section background="cream-3" size="sm">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="type-section-title">{t('title')}</h2>
        <p className="type-lede mt-4">{t('lede')}</p>

        {subscribed ? (
          <p className="mt-8 rounded-sm bg-cream p-6 text-sm font-semibold text-ink" role="status">
            {t('success')}
          </p>
        ) : (
          <form className="mt-8 flex flex-col items-center gap-3" noValidate onSubmit={onSubmit}>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                {t('placeholder')}
              </label>
              <input
                aria-describedby={emailError ? 'newsletter-email-error' : undefined}
                aria-invalid={Boolean(emailError)}
                autoComplete="email"
                className="w-full rounded-full border border-border bg-cream px-5 py-3 text-sm text-ink placeholder:text-body focus-visible:border-accent-deep sm:flex-1"
                id="newsletter-email"
                name="email"
                placeholder={t('placeholder')}
                required
                type="email"
              />
              <Button disabled={submitting} size="md" type="submit" variant="primary">
                {submitting ? t('submitting') : t('submit')}
              </Button>
            </div>
            {emailError && (
              <p className="text-xs font-semibold text-coral" id="newsletter-email-error" role="alert">
                {emailError}
              </p>
            )}

            <label className="flex items-start gap-2 text-left text-xs text-body" htmlFor="newsletter-consent">
              <input
                aria-describedby={consentError ? 'newsletter-consent-error' : undefined}
                aria-invalid={Boolean(consentError)}
                className="mt-0.5 accent-accent-deep"
                id="newsletter-consent"
                name="consent"
                required
                type="checkbox"
              />
              {t('consent')}
            </label>
            {consentError && (
              <p className="text-xs font-semibold text-coral" id="newsletter-consent-error" role="alert">
                {consentError}
              </p>
            )}

            {formError && (
              <p className="text-xs font-semibold text-coral" role="alert">
                {formError}
              </p>
            )}
          </form>
        )}
      </div>
    </Section>
  )
}
