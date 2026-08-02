import type { InquiryInput } from '@/lib/utils/validation'

export type SubmitResult =
  | { ok: true; referenceId: string }
  | {
      ok: false
      errors?: Record<string, string>
      error?: 'rate_limited' | 'server_error' | 'network'
    }

/**
 * `/api/inquiry` ucuna gönderim yapar (Task 12 sözleşmesi): 200 { ok:true, referenceId } ·
 * 400 { ok:false, errors } · 429 { ok:false, error:'rate_limited' } · 500 { ok:false,
 * error:'server_error' }. `kind` alanı (`camp` | `contact` | `newsletter`) tamamen
 * `InquiryInput`'tan gelir — bu fonksiyon hiçbir varyanta özel davranmaz, bu yüzden
 * Task 14'ün `kind: 'contact'` gövdesi burada değişiklik gerektirmez.
 *
 * Ağ hatası (fetch reddi — sunucu kapalı, DNS, CORS, vb. — ya da yanıt gövdesi hiç JSON
 * değilse) `error: 'network'` olarak ele alınır. Çağıran taraf (inquiry-form,
 * newsletter-cta) form verisini KORUMALI ve WhatsApp alternatifini öne çıkarmalıdır —
 * bu fonksiyon hiçbir state'e dokunmaz, yalnızca sonucu döner.
 */
export async function submitInquiry(input: InquiryInput): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = (await response.json()) as SubmitResult
    if (response.ok && data.ok) return data
    return data.ok === false ? data : { ok: false, error: 'server_error' }
  } catch {
    return { ok: false, error: 'network' }
  }
}

/** `useTranslations('form.errors')` ya da `getTranslations('form.errors')`'ın döndürdüğü şeklin küçültülmüş hali. */
type ErrorTranslator = {
  (key: string): string
  has: (key: string) => boolean
}

/**
 * Sunucudan gelen hata ANAHTARINI (`invalidEmail`, `rateLimited`, ...) çevrilmiş bir
 * cümleye dönüştürür. `translator.has()` kontrolü BİLİNÇLİ bir dal: next-intl'in eksik
 * anahtar davranışına (konsola hata basıp bir yer tutucu döndürmesine) güvenmek yerine,
 * sunucudan mesaj dosyasıyla senkron olmayan/bozuk bir anahtar gelirse ham anahtarı asla
 * arayüze sızdırmadan `form.errors.generic`'e düşülür. Hem `inquiry-form` hem
 * `newsletter-cta` bunu kullanır ki bu dal iki yerde ayrı ayrı (ve tutarsızca) tekrar
 * edilmesin.
 */
export function resolveErrorMessage(translator: ErrorTranslator, key: string): string {
  return translator.has(key) ? translator(key) : translator('generic')
}
