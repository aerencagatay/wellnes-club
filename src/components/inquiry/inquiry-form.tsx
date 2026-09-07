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
import { formatPrice } from '@/lib/utils/price'
import { ConsentCheckbox } from './consent-checkbox'
import { Field, fieldDescribedBy, inputClass } from './field'

export function InquiryForm({ camps, locale }: { camps: CampSession[]; locale: AppLocale }) {
  const t = useTranslations('form')
  // Gece etiketi ("2 gece") `camp` sözlüğünde: kart, tablo ve form aynı
  // ifadeyi paylaşsın — üç ayrı yerde üç farklı yazım olmasın.
  const tCamp = useTranslations('camp')
  const te = useTranslations('form.errors')
  const router = useRouter()
  const params = useSearchParams()

  // Bilinmeyen/uydurma bir ?kamp= değeri sessizce ilk (en yakın) kampa düşer — hata
  // fırlatmaz, kullanıcıyı boş bir formla baş başa bırakmaz.
  const preselected = params.get('kamp')
  const initialCamp = camps.some((camp) => camp.slug === preselected) ? preselected! : (camps[0]?.slug ?? '')

  // Kamp seçimi KONTROLLÜ: gece seçenekleri seçili kampın kendi fiyat
  // kademelerinden türetiliyor, sabit bir liste değil. Kamp satmadığı bir gece
  // sayısını teklif etmemeli.
  const [campSlug, setCampSlug] = useState(initialCamp)

  // Seçili kampın sattığı GECE SAYILARI, kendi fiyat kademelerinden türetilir
  // ve artan sırada gösterilir. `Set` yinelenenleri eler: aynı gece sayısı hem
  // paylaşımlı hem tek kişilik oda için ayrı kademe olarak duruyor.
  const selectedCamp = camps.find((c) => c.slug === campSlug)

  const nightOptions = selectedCamp
    ? [...new Set(selectedCamp.priceTiers.map((tier) => tier.nights))].sort((a, b) => a - b)
    : []

  // Oda tipi ve gece sayısı KONTROLLÜ: ikisi birlikte fiyatı belirliyor ve
  // seçim değiştiği anda gösterilen fiyatın da değişmesi gerekiyor.
  const [roomPreference, setRoomPreference] = useState<'paylasimli' | 'tek-kisilik'>('paylasimli')
  // Kişi sayısı da fiyata giriyor (kişi başı × kişi), bu yüzden kontrollü.
  const [guests, setGuests] = useState(1)
  const [nights, setNights] = useState<number>(() => nightOptions.at(-1) ?? 1)

  /**
   * Seçime karşılık gelen kişi başı fiyat.
   *
   * `priceTiers`'ten OKUNUR, hesaplanmaz: fiyat listesi tek kaynaktır ve
   * burada bir çarpım/formül kurmak, tablo değiştiğinde sessizce ayrışan
   * ikinci bir gerçek üretirdi. Kademe yoksa `undefined` döner — o birleşim
   * satılmıyor demektir ve arayüz bunu açıkça söyler (doğrulama da aynı
   * kuralla reddeder, bkz. validation.ts → superRefine).
   */
  const selectedTier = selectedCamp?.priceTiers.find(
    (tier) => tier.nights === nights && tier.occupancy === (roomPreference === 'paylasimli' ? 'double' : 'single'),
  )
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
  const nightsError = translateError(errors.nights)
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
      nights: Number(data.get('nights') ?? 0),
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
          id="campSlug"
          name="campSlug"
          onChange={(event) => setCampSlug(event.target.value)}
          required
          value={campSlug}
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
            id="guests"
            max={8}
            min={1}
            name="guests"
            // Boş bırakılırsa `Number('')` sıfır verir ve toplam sıfıra düşerdi;
            // kutu boşken hesap 1 kişi üzerinden gösterilir. Gerçek doğrulama
            // yine sunucuda (`guestsMin`).
            onChange={(event) => setGuests(Number(event.target.value) || 1)}
            required
            type="number"
            value={guests}
          />
        </Field>
        <Field error={roomError} htmlFor="roomPreference" label={t('roomPreference')}>
          <select
            aria-describedby={fieldDescribedBy('roomPreference', { error: roomError })}
            aria-invalid={Boolean(roomError)}
            className={inputClass}
            id="roomPreference"
            name="roomPreference"
            onChange={(event) => setRoomPreference(event.target.value as 'paylasimli' | 'tek-kisilik')}
            value={roomPreference}
          >
            <option value="paylasimli">{t('roomShared')}</option>
            <option value="tek-kisilik">{t('roomSingle')}</option>
          </select>
        </Field>
      </div>

      {/* GECE SAYISI — fiyatı belirleyen ikinci eksen (birincisi oda tipi).
          Bu alan yoktu ve başvuru hangi fiyata yapıldığını söylemiyordu:
          18-20 Eylül iki gece, 19-20 Eylül tek gece olarak ayrı ayrı
          satılıyor (kullanıcı bildirimi, 2026-09-07).

          Seçenekler seçili kampın KENDİ kademelerinden türetiliyor; sabit bir
          "1 veya 2" listesi, kampın satmadığı bir süreyi teklif edebilirdi. */}
      <Field error={nightsError} htmlFor="nights" label={t('nights')}>
        <select
          aria-describedby={fieldDescribedBy('nights', { error: nightsError })}
          aria-invalid={Boolean(nightsError)}
          className={inputClass}
          id="nights"
          name="nights"
          onChange={(event) => setNights(Number(event.target.value))}
          required
          value={nights}
        >
          {nightOptions.map((n) => (
            <option key={n} value={n}>
              {tCamp('nights', { count: n })}
            </option>
          ))}
        </select>
      </Field>

      {/* CANLI FİYAT — seçimi belirleyen üç alanın hemen altında.
          Fiyat oda tipi × gece sayısına göre değişiyor (dört kademe) ve kişi
          sayısıyla çarpılıyor; kenar çubuğundaki kart ise "başlangıç fiyatı"nı
          gösterip seçime tepki vermiyor. Ziyaretçinin seçtiği şeyin karşılığını
          seçtiği yerde görmesi gerekiyor (kullanıcı bildirimi, 2026-09-07).

          TOPLAM BİR TEKLİF DEĞİL, BİR HESAP: sayfa zaten "Ödeme bu aşamada
          alınmaz" diyor ve ekip kontenjan/ödeme detayını sonra netleştiriyor.
          Bu yüzden toplam, kişi başı fiyat ve çarpan AÇIKÇA gösteriliyor —
          ziyaretçi sayının nereden geldiğini görebilsin. */}
      {selectedCamp && (
        <div aria-live="polite" className="border border-text bg-paper p-5">
          {selectedTier ? (
            <>
              <span className="type-eyebrow">{t('priceForSelection')}</span>
              <p className="mt-2 font-heading text-3xl font-bold tracking-[-0.02em] text-text tabular-nums">
                {formatPrice(selectedTier.price * guests, selectedCamp.currency, locale)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {t('priceBreakdown', {
                  guests,
                  unit: formatPrice(selectedTier.price, selectedCamp.currency, locale),
                })}
              </p>
              <p className="mt-1 text-sm text-muted">
                {roomPreference === 'paylasimli' ? t('roomShared') : t('roomSingle')}
                <span aria-hidden className="mx-2">·</span>
                {tCamp('nights', { count: nights })}
              </p>
            </>
          ) : (
            // Satılmayan birleşim: uydurma bir fiyat göstermek yerine durumu
            // söyler. Doğrulama da aynı birleşimi reddediyor.
            <p className="text-sm font-medium text-text">{te('unknownTier')}</p>
          )}
        </div>
      )}

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
