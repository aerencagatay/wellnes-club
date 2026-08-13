'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import type { CampSession } from '@/content'
import type { AppLocale } from '@/i18n/routing'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'
import { resolveErrorMessage, submitInquiry } from '@/lib/inquiry-client'
import { formatDateRange } from '@/lib/utils/dates'
import { ConsentCheckbox } from './consent-checkbox'
import { Field, fieldDescribedBy, inputClass } from './field'

export function InquiryForm({ camps, locale }: { camps: CampSession[]; locale: AppLocale }) {
  const t = useTranslations('form')
  const te = useTranslations('form.errors')
  const router = useRouter()
  const params = useSearchParams()

  // Bilinmeyen/uydurma bir ?kamp= değeri sessizce ilk (en yakın) kampa düşer — hata
  // fırlatmaz, kullanıcıyı boş bir formla baş başa bırakmaz.
  const preselected = params.get('kamp')
  const initialCamp = camps.some((camp) => camp.slug === preselected) ? preselected! : (camps[0]?.slug ?? '')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failedOnce, setFailedOnce] = useState(false)

  // `te.has` kontrolü BİLİNÇLİ bir dal: sunucudan mesaj dosyasıyla senkron olmayan bir
  // anahtar gelirse next-intl'in varsayılan "eksik anahtar" davranışına (konsola loglayıp
  // bir yer tutucu döndürmesine) güvenmek yerine açıkça `generic`'e düşülür. Bkz.
  // inquiry-client.ts → resolveErrorMessage.
  function translateError(key: string | undefined): string | undefined {
    return key ? resolveErrorMessage(te, key) : undefined
  }

  const nameError = translateError(errors.name)
  const emailError = translateError(errors.email)
  const phoneError = translateError(errors.phone)
  const campError = translateError(errors.campSlug)
  const guestsError = translateError(errors.guests)
  const roomError = translateError(errors.roomPreference)
  const messageError = translateError(errors.message)
  const consentError = translateError(errors.consent)
  const formError = translateError(errors.form)
  const messageHint = t('messageHint')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})

    const data = new FormData(event.currentTarget)
    const result = await submitInquiry({
      kind: 'camp',
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      campSlug: String(data.get('campSlug') ?? ''),
      guests: Number(data.get('guests') ?? 1),
      roomPreference: data.get('roomPreference') as 'paylasimli' | 'tek-kisilik',
      message: String(data.get('message') ?? '') || undefined,
      // `InquiryInput`'ta consent zod'un `z.literal(true)`'ından geldiği için tip `true`,
      // `boolean` değil. Kutu işaretlenmemişse burada `false` göndermek BİLİNÇLİDİR —
      // `noValidate` felsefesiyle tutarlı olarak istemci burada engellemez, sunucu
      // `consentRequired` ile reddeder. Cast yalnızca BU alana daraltılmıştır ki diğer
      // alanlardaki bir yazım/tip hatası derleme zamanında yine yakalansın (bkz. brief'in
      // tüm gövdeyi `as never` ile geçersiz kılan — ve bu yüzden hiçbir alanı denetlemeyen
      // — sürümü; burada bilinçli olarak tercih edilmedi).
      consent: (data.get('consent') === 'on') as true,
    })

    if (result.ok) {
      // `submitting` KASITLI olarak burada temizlenmez: önce temizleyip sonra
      // yönlendirmek arada bir an için düğmeyi tekrar tıklanabilir bırakır — hızlı bir
      // ikinci tık organizatöre aynı başvurunun ikinci bir e-postasını gönderebilir.
      // Sayfa zaten `router.push` ile değişeceği için `submitting`'i true bırakmanın
      // hiçbir görsel maliyeti yok.
      router.push(`/basvuru-alindi?ref=${result.referenceId}`)
      return
    }

    setSubmitting(false)
    setFailedOnce(true)
    // Form verisi korunur: tüm alanlar denetimsiz (uncontrolled) — bileşen yeniden
    // bağlanmadığı (remount) sürece kullanıcının girdiği değerler DOM'da kalır, yalnızca
    // hata durumu güncellenir.
    setErrors(result.errors ?? { form: result.error === 'rate_limited' ? 'rateLimited' : 'generic' })
  }

  const whatsappUrl = buildWhatsAppUrl(t('whatsappFallbackMessage'))

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <Field error={nameError} htmlFor="name" label={t('name')}>
        <input
          aria-describedby={fieldDescribedBy('name', { error: nameError })}
          aria-invalid={Boolean(nameError)}
          autoComplete="name"
          className={inputClass}
          id="name"
          name="name"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={emailError} htmlFor="email" label={t('email')}>
          <input
            aria-describedby={fieldDescribedBy('email', { error: emailError })}
            aria-invalid={Boolean(emailError)}
            autoComplete="email"
            className={inputClass}
            id="email"
            name="email"
            required
            type="email"
          />
        </Field>
        <Field error={phoneError} htmlFor="phone" label={t('phone')}>
          <input
            aria-describedby={fieldDescribedBy('phone', { error: phoneError })}
            aria-invalid={Boolean(phoneError)}
            autoComplete="tel"
            className={inputClass}
            id="phone"
            name="phone"
            required
            type="tel"
          />
        </Field>
      </div>

      <Field error={campError} htmlFor="campSlug" label={t('camp')}>
        <select
          aria-describedby={fieldDescribedBy('campSlug', { error: campError })}
          aria-invalid={Boolean(campError)}
          className={inputClass}
          defaultValue={initialCamp}
          id="campSlug"
          name="campSlug"
          required
        >
          {camps.map((camp) => (
            <option key={camp.slug} value={camp.slug}>
              {camp.title[locale]} — {formatDateRange(camp.startDate, camp.endDate, locale)}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={guestsError} htmlFor="guests" label={t('guests')}>
          <input
            aria-describedby={fieldDescribedBy('guests', { error: guestsError })}
            aria-invalid={Boolean(guestsError)}
            className={inputClass}
            defaultValue={1}
            id="guests"
            max={8}
            min={1}
            name="guests"
            required
            type="number"
          />
        </Field>
        <Field error={roomError} htmlFor="roomPreference" label={t('roomPreference')}>
          <select
            aria-describedby={fieldDescribedBy('roomPreference', { error: roomError })}
            aria-invalid={Boolean(roomError)}
            className={inputClass}
            defaultValue="paylasimli"
            id="roomPreference"
            name="roomPreference"
          >
            <option value="paylasimli">{t('roomShared')}</option>
            <option value="tek-kisilik">{t('roomSingle')}</option>
          </select>
        </Field>
      </div>

      <Field error={messageError} hint={messageHint} htmlFor="message" label={t('message')}>
        <textarea
          aria-describedby={fieldDescribedBy('message', { error: messageError, hint: messageHint })}
          aria-invalid={Boolean(messageError)}
          className={inputClass}
          id="message"
          maxLength={1000}
          name="message"
          rows={4}
        />
      </Field>

      <ConsentCheckbox error={consentError} />

      {formError && (
        <p className="rounded-[var(--radius-btn)] border border-text/15 bg-sand/40 p-4 text-sm font-medium text-text" role="alert">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button disabled={submitting} size="lg" type="submit">
          {submitting ? t('submitting') : t('submit')}
        </Button>
        {failedOnce && whatsappUrl && (
          <a
            className="text-sm font-semibold text-olive hover:underline"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('whatsappFallback')}
          </a>
        )}
      </div>
    </form>
  )
}
