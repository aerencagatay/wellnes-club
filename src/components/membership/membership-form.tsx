'use client'

import { useTranslations } from 'next-intl'
import { useId, useState } from 'react'
import { Field, fieldDescribedBy, inputClass } from '@/components/inquiry/field'
import { HandUnderline, SunMark } from '@/components/art/marks'
import { Button } from '@/components/ui/button'
import {
  MEMBERSHIP_AGE_MAX,
  MEMBERSHIP_AGE_MIN,
  type MembershipDraft,
  type MembershipErrorKey,
  validateMembership,
} from '@/lib/utils/membership-validation'

/**
 * =============================================================================
 * ÜYELİK BAŞVURU FORMU — YALNIZCA ARAYÜZ, BACKEND YOK
 * =============================================================================
 * Kullanıcı kararı (2026-09-05): Membership rafa kaldırıldı; sayfa navigasyonda
 * görünsün ama ARKA UÇ BAĞLANMASIN.
 *
 * Bunun uygulamadaki karşılığı çok net: bu form hiçbir yere İSTEK ATMAZ.
 * `handleSubmit` doğrulamayı çalıştırır ve başarılıysa yalnızca yerel bir
 * "gönderildi" durumuna geçer.
 *
 * SUNUCU KALICILIĞI TAKLİT EDİLMEZ (prompt §Form Behavior). Bir `setTimeout`
 * ile sahte ağ gecikmesi eklemek veya `localStorage`a yazıp "kaydedildi"
 * demek, ziyaretçiye başvurusunun ULAŞTIĞINI söylemek olurdu — oysa hiçbir
 * yere ulaşmıyor. Bu yüzden başarı metni de (`successBody`) başvurunun
 * iletildiğini DEĞİL, üyeliğin henüz açık olmadığını ve iletişime
 * geçileceğini anlatır.
 *
 * ARKA UÇ BAĞLANDIĞINDA: `handleSubmit` içindeki tek `setSubmitted(true)`
 * satırının yerine `/api/...` çağrısı gelir. Doğrulama, hata gösterimi,
 * erişilebilirlik bağlantıları ve başarı durumu olduğu gibi kalır —
 * `validateMembership` zaten sunucuda da çağrılabilecek saf bir fonksiyon
 * (bkz. membership-validation.ts).
 */
export function MembershipForm() {
  const t = useTranslations('membership.form')
  const tErrors = useTranslations('membership.errors')

  // Alan kimlikleri `useId` ile üretilir: sayfada formun ikinci bir örneği
  // render edilirse sabit kimlikler (`id="email"`) çakışır ve `<label for>`
  // yanlış alana bağlanır.
  const uid = useId()
  const fieldId = (name: keyof MembershipDraft) => `${uid}-${name}`

  const [values, setValues] = useState<MembershipDraft>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    yogaLevel: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof MembershipDraft, MembershipErrorKey>>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (name: keyof MembershipDraft) => (event: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }))
    // Kullanıcı yazmaya başladığı anda o alanın hatası temizlenir: hata
    // mesajının düzeltme sırasında ekranda durması, düzeltilmiş bir alanı
    // hâlâ hatalıymış gibi gösterir.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validateMembership(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // İlk hatalı alana odaklan: hata mesajları form boyunca dağılmış
      // olabilir ve uzun bir formda kullanıcı ilk hatayı görmeden kalabilir.
      const firstKey = Object.keys(found)[0] as keyof MembershipDraft
      document.getElementById(fieldId(firstKey))?.focus()
      return
    }
    // BURADA AĞ İSTEĞİ YOK — bkz. dosya başlığı.
    setSubmitted(true)
  }

  const errorText = (name: keyof MembershipDraft) => {
    const key = errors[name]
    return key ? tErrors(key) : undefined
  }

  if (submitted) {
    return (
      <div className="border-2 border-text bg-paper p-8 text-center md:p-12" role="status">
        <SunMark className="ink-sun mx-auto h-16 w-16" />
        <h2 className="type-title mt-6">{t('successTitle')}</h2>
        <p className="type-lede mx-auto mt-4 max-w-md">{t('successBody')}</p>
      </div>
    )
  }

  return (
    // `noValidate`: doğrulama tamamen bizde. Tarayıcının kendi baloncukları
    // çevrilmiş metinlerimizi değil tarayıcı dilinin metnini gösterir ve
    // `Field`in erişilebilir hata bağlantılarını atlar.
    <form className="border-2 border-text bg-background p-6 md:p-10" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field error={errorText('firstName')} htmlFor={fieldId('firstName')} label={t('firstName')}>
          <input
            aria-describedby={fieldDescribedBy(fieldId('firstName'), { error: errorText('firstName') })}
            aria-invalid={errors.firstName ? true : undefined}
            autoComplete="given-name"
            className={inputClass}
            id={fieldId('firstName')}
            name="firstName"
            onChange={set('firstName')}
            type="text"
            value={values.firstName}
          />
        </Field>

        <Field error={errorText('lastName')} htmlFor={fieldId('lastName')} label={t('lastName')}>
          <input
            aria-describedby={fieldDescribedBy(fieldId('lastName'), { error: errorText('lastName') })}
            aria-invalid={errors.lastName ? true : undefined}
            autoComplete="family-name"
            className={inputClass}
            id={fieldId('lastName')}
            name="lastName"
            onChange={set('lastName')}
            type="text"
            value={values.lastName}
          />
        </Field>

        <Field error={errorText('email')} htmlFor={fieldId('email')} label={t('email')}>
          <input
            aria-describedby={fieldDescribedBy(fieldId('email'), { error: errorText('email') })}
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            className={inputClass}
            id={fieldId('email')}
            name="email"
            onChange={set('email')}
            type="email"
            value={values.email}
          />
        </Field>

        <Field
          error={errorText('phone')}
          hint={t('phoneHint')}
          htmlFor={fieldId('phone')}
          label={t('phone')}
        >
          <input
            aria-describedby={fieldDescribedBy(fieldId('phone'), {
              error: errorText('phone'),
              hint: t('phoneHint'),
            })}
            aria-invalid={errors.phone ? true : undefined}
            autoComplete="tel"
            className={inputClass}
            id={fieldId('phone')}
            name="phone"
            onChange={set('phone')}
            type="tel"
            value={values.phone}
          />
        </Field>

        <Field error={errorText('age')} htmlFor={fieldId('age')} label={t('age')}>
          <input
            aria-describedby={fieldDescribedBy(fieldId('age'), { error: errorText('age') })}
            aria-invalid={errors.age ? true : undefined}
            className={inputClass}
            id={fieldId('age')}
            inputMode="numeric"
            max={MEMBERSHIP_AGE_MAX}
            min={MEMBERSHIP_AGE_MIN}
            name="age"
            onChange={set('age')}
            type="number"
            value={values.age}
          />
        </Field>

        <Field error={errorText('gender')} htmlFor={fieldId('gender')} label={t('gender')}>
          <select
            aria-describedby={fieldDescribedBy(fieldId('gender'), { error: errorText('gender') })}
            aria-invalid={errors.gender ? true : undefined}
            className={inputClass}
            id={fieldId('gender')}
            name="gender"
            onChange={set('gender')}
            value={values.gender}
          >
            <option value="">{t('selectPlaceholder')}</option>
            <option value="female">{t('genderFemale')}</option>
            <option value="male">{t('genderMale')}</option>
            {/* "Belirtmek istemiyorum" seçeneği BİLİNÇLİ olarak var: cinsiyet
                kişisel veridir ve zorunlu bir alanda yalnızca iki seçenek
                sunmak, başvurmak isteyen kişiyi kendini tanımlamadığı bir
                kutuyu işaretlemeye zorlar. */}
            <option value="unspecified">{t('genderUnspecified')}</option>
          </select>
        </Field>

        <Field
          className="sm:col-span-2"
          error={errorText('yogaLevel')}
          htmlFor={fieldId('yogaLevel')}
          label={t('yogaLevel')}
        >
          <select
            aria-describedby={fieldDescribedBy(fieldId('yogaLevel'), { error: errorText('yogaLevel') })}
            aria-invalid={errors.yogaLevel ? true : undefined}
            className={inputClass}
            id={fieldId('yogaLevel')}
            name="yogaLevel"
            onChange={set('yogaLevel')}
            value={values.yogaLevel}
          >
            <option value="">{t('selectPlaceholder')}</option>
            {/* Yalnızca iki seviye — prompt §Membership Page. "İleri" seviye
                kasıtlı olarak yok: kulüp küçük grup retreat'i düzenliyor ve
                bugün yalnızca bu iki seviyeye program veriyor. */}
            <option value="beginner">{t('levelBeginner')}</option>
            <option value="intermediate">{t('levelIntermediate')}</option>
          </select>
        </Field>
      </div>

      <HandUnderline className="ink-sun mt-10 h-2.5 w-full opacity-60" />

      <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">{t('privacyNote')}</p>
        <Button size="lg" type="submit" variant="primary">
          {t('submit')}
        </Button>
      </div>
    </form>
  )
}
