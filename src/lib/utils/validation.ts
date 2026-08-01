import { z } from 'zod'
import { getCampBySlug } from '@/content'

/**
 * Temel tip kontrolü (`invalid_type`, ör. alan tamamen eksik) ile zincirdeki
 * `.min()/.max()/.refine()` kontrolleri zod'da ayrı geçişlerdir: birine `message`
 * vermek diğerini kapsamaz. Her string/number alanına taban `message` de vererek
 * alan tamamen eksik gönderildiğinde de zod'un İngilizce varsayılan cümlesi değil,
 * anahtar dönmesini garantiliyoruz (bkz. flattenZodErrors sözleşmesi).
 *
 * Bu, YALNIZCA taban tip kontrolünü kapsar. Zincirdeki HER `.min()/.max()/.email()/
 * .int()/.refine()` çağrısının da kendi `message`'ı olmalı — birini atlamak (ör.
 * `.min(1)` mesajsız bırakmak) o kontrol tetiklendiğinde zod'un İngilizce varsayılan
 * cümlesini sızdırır. `validation.error-keys.test.ts` tam bunu, gerçek girdilerle
 * tarayarak denetler; "anahtar var mı" araması bunu asla yakalayamaz çünkü sorun bir
 * mesajın *var olması* değil, *hiç olmaması*dır.
 *
 * Taban tip mesajları için özel bir "alan eksik" anahtarı icat etmek yerine, o alanın
 * zaten var olan anahtarlarından birini yeniden kullanıyoruz: ör. `guests` tamamen
 * eksikse de `guestsInteger` döner, ayrı bir "guestsRequired" anahtarı yoktur. Bu
 * bilinçli bir sadeleştirme (YAGNI) — sonraki okuyucu için not düşülüyor.
 */
const phone = z
  .string({ message: 'invalidPhone' })
  .trim()
  .min(1, { message: 'invalidPhone' })
  .max(32, { message: 'invalidPhone' })
  .refine((value) => /^[\d\s+()./-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7, {
    message: 'invalidPhone',
  })

const email = z
  .string({ message: 'invalidEmail' })
  .trim()
  .toLowerCase()
  .email({ message: 'invalidEmail' })
const name = z
  .string({ message: 'nameTooShort' })
  .trim()
  .min(2, { message: 'nameTooShort' })
  .max(80, { message: 'nameTooLong' })
const consent = z.literal(true, { message: 'consentRequired' })
/** Turnstile jetonu makine tarafından üretilir; kullanıcıya gösterilen bir alan değildir, bu yüzden `generic`'e düşer. */
const turnstileToken = z.string({ message: 'generic' }).optional()

const campInquiry = z.object({
  kind: z.literal('camp'),
  name,
  email,
  phone,
  campSlug: z
    .string({ message: 'unknownCamp' })
    .refine((slug) => getCampBySlug(slug) !== undefined, { message: 'unknownCamp' }),
  guests: z
    .number({ message: 'guestsInteger' })
    .int({ message: 'guestsInteger' })
    .min(1, { message: 'guestsMin' })
    .max(8, { message: 'guestsMax' }),
  roomPreference: z.enum(['paylasimli', 'tek-kisilik'], { message: 'invalidRoomPreference' }),
  message: z
    .string({ message: 'messageTooLong' })
    .trim()
    .max(1000, { message: 'messageTooLong' })
    .optional(),
  consent,
  turnstileToken,
})

const contactInquiry = z.object({
  kind: z.literal('contact'),
  name,
  email,
  message: z
    .string({ message: 'messageRequired' })
    .trim()
    .min(1, { message: 'messageRequired' })
    .max(1000, { message: 'messageTooLong' }),
  consent,
  turnstileToken,
})

const newsletterInquiry = z.object({
  kind: z.literal('newsletter'),
  email,
  consent,
  turnstileToken,
})

/** Bilinmeyen/eksik `kind` bir form doğrulama hatası değil, bozuk bir istektir — `generic` anahtarına düşer. */
export const inquirySchema = z.discriminatedUnion('kind', [campInquiry, contactInquiry, newsletterInquiry], {
  message: 'generic',
})

export type CampInquiry = z.infer<typeof campInquiry>
export type ContactInquiry = z.infer<typeof contactInquiry>
export type NewsletterInquiry = z.infer<typeof newsletterInquiry>
export type InquiryInput = z.infer<typeof inquirySchema>

/**
 * Alan başına ilk hata mesajını döner — arayüz alan altına tek satır basar.
 * Kök seviyesindeki hatalar (ör. gövde hiç nesne değilse) boş bir `path` taşır;
 * bunlar `form` anahtarı altında toplanır — Task 12'nin `{ ok: false, errors: {
 * form: 'generic' } }` sözleşmesi ve Task 13'ün üst banner'ı bu anahtarı okur.
 */
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = typeof issue.path[0] === 'string' ? issue.path[0] : 'form'
    if (!(field in result)) {
      result[field] = issue.message
    }
  }
  return result
}
