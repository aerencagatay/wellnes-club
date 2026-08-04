'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ConsentCheckbox } from '@/components/inquiry/consent-checkbox'
import { Field, fieldDescribedBy, inputClass } from '@/components/inquiry/field'
import { resolveErrorMessage, submitInquiry } from '@/lib/inquiry-client'

// Sunucudan gelen hata anahtarları (`nameTooShort`, `invalidEmail`, `messageRequired`,
// `consentRequired`, `generic`, `rateLimited`) `contactInquiry` zod şemasının ürettiği
// kümenin tamamıdır — hepsi zaten `form.errors` altında tanımlı, bu form için ayrı bir
// hata mesajı seti gerekmiyor.
export function ContactForm() {
  const t = useTranslations('contact.form')
  const te = useTranslations('form.errors')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)

  function translateError(key: string | undefined): string | undefined {
    return key ? resolveErrorMessage(te, key) : undefined
  }

  const nameError = translateError(errors.name)
  const emailError = translateError(errors.email)
  const messageError = translateError(errors.message)
  const consentError = translateError(errors.consent)
  const formError = translateError(errors.form)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})

    const data = new FormData(event.currentTarget)
    const result = await submitInquiry({
      kind: 'contact',
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      // Bkz. inquiry-form.tsx'teki aynı satır: consent zod'da `z.literal(true)`, `boolean`
      // değil. Kutu işaretli değilse `false` göndermek bilinçlidir — sunucu
      // `consentRequired` ile reddeder; cast yalnızca bu tek alana daraltılmıştır.
      consent: (data.get('consent') === 'on') as true,
    })

    if (result.ok) {
      // `submitting` KASITLI olarak burada temizlenmez: önce temizleyip sonra formu
      // teşekkür görünümüyle değiştirmek arada bir an için düğmeyi tekrar tıklanabilir
      // bırakır — hızlı bir ikinci tık organizatöre aynı mesajın ikinci bir e-postasını
      // gönderebilir. Form zaten `referenceId` ile kaldırılacağı için `submitting`'i
      // true bırakmanın hiçbir görsel maliyeti yok.
      setReferenceId(result.referenceId)
      return
    }

    setSubmitting(false)
    // Form verisi korunur: tüm alanlar denetimsiz (uncontrolled) — bileşen yeniden
    // bağlanmadığı sürece kullanıcının girdiği değerler DOM'da kalır, yalnızca hata
    // durumu güncellenir.
    setErrors(result.errors ?? { form: result.error === 'rate_limited' ? 'rateLimited' : 'generic' })
  }

  if (referenceId) {
    return (
      <div className="rounded-md bg-surface p-8" role="status">
        <h2 className="font-heading text-2xl text-text">{t('successTitle')}</h2>
        {/* text-muted: bu kutu bg-surface zemininde, düz gövde metni orada WCAG AA
            eşiğinin altında kalır (bkz. globals.css'teki --color-muted token yorumu). */}
        <p className="mt-3 text-sm text-muted">{t('successBody')}</p>
        <p className="mt-6 inline-block rounded-sm bg-background px-6 py-4 text-sm">
          {t('successReference')} <strong className="font-mono tracking-wider text-text">{referenceId}</strong>
        </p>
      </div>
    )
  }

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

      <Field error={messageError} htmlFor="message" label={t('message')}>
        <textarea
          aria-describedby={fieldDescribedBy('message', { error: messageError })}
          aria-invalid={Boolean(messageError)}
          className={inputClass}
          id="message"
          maxLength={1000}
          name="message"
          required
          rows={5}
        />
      </Field>

      <ConsentCheckbox error={consentError} />

      {formError && (
        <p className="rounded-sm bg-sand/40 p-4 text-sm font-medium text-text" role="alert">
          {formError}
        </p>
      )}

      <div>
        <Button disabled={submitting} size="lg" type="submit">
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  )
}
