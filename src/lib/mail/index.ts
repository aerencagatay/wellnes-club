import { site } from '@/lib/config/site'
import type { InquiryInput } from '@/lib/utils/validation'
import { renderAutoReply, renderInternalNotification } from './templates'

const FROM = `Serenity Retreats <bilgi@${new URL(site.url).hostname.replace(/^www\./, '')}>`

/**
 * `input` çağıran tarafından zaten `parsed.data` (zod çıktısı) olarak verilmelidir —
 * bkz. templates.ts başındaki not. Bu fonksiyon ham istek gövdesini asla görmemeli.
 */
export async function sendInquiryEmails(
  input: InquiryInput,
  referenceId: string,
): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.INQUIRY_TO_EMAIL

  // Şablon render'ları da dahil tüm gövde tek bir try içinde: bir render hatası
  // (ör. templates.ts'te beklenmedik bir istisna) bu fonksiyonun dışına, route.ts'in
  // genel yakalayıcısına kaçarsa istek 500'e düşer ve zaten üretilmiş referans numarası
  // ziyaretçiye asla ulaşmaz — bu tasarımın tam olarak önlemeye çalıştığı şey.
  try {
    const internal = renderInternalNotification(input, referenceId)
    const autoReply = renderAutoReply(input, referenceId)

    // Yapılandırma eksikken formu kırmak yerine akışı loglayarak devam et: geliştirme
    // ortamında ve yanlış yapılandırılmış üretimde talep formu görünürde çalışmaya
    // devam eder, kayıp yalnızca sunucu konsolunda görülür.
    if (!apiKey || !to) {
      console.info('[inquiry] E-posta yapılandırılmadı, gönderim atlandı.', {
        referenceId,
        kind: input.kind,
        subject: internal.subject,
      })
      return { delivered: false }
    }

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const results = await Promise.allSettled([
      resend.emails.send({ from: FROM, to, replyTo: input.email, ...internal }),
      resend.emails.send({ from: FROM, to: input.email, ...autoReply }),
    ])

    // ÖNEMLİ: Resend SDK'sı API düzeyinde bir hatada (ör. geçersiz anahtar, kota
    // aşımı) promise'i reddetmez — `{ data: null, error: {...} }` ile "başarıyla"
    // çözümler. Bu yüzden yalnızca `status === 'rejected'` bakmak (ağ/istisna
    // düzeyi hataları) yetmez; her çözümlenen sonucun içindeki `error` alanını da
    // kontrol etmek gerekir, yoksa gerçek bir gönderim başarısızlığı sessizce
    // `delivered: true` olarak raporlanır — organizatör talebi asla görmez ama
    // sistem her şey yolundaymış gibi davranır.
    const failures = results.flatMap((result, index) => {
      if (result.status === 'rejected') return [{ index, reason: result.reason }]
      if (result.value.error) return [{ index, reason: result.value.error }]
      return []
    })
    if (failures.length > 0) {
      console.error('[inquiry] E-posta gönderimi kısmen başarısız', { referenceId, failures })
    }
    // Kurum bildirimi (ilk gönderim) gerçekten gittiyse teslim edilmiş sayılır — asıl
    // iş organizatörün talebi görmesidir, otomatik yanıtın başarısız olması ikincildir.
    const internalResult = results[0]
    const internalDelivered = internalResult.status === 'fulfilled' && internalResult.value.error === null
    return { delivered: internalDelivered }
  } catch (error) {
    console.error('[inquiry] E-posta gönderim katmanı başlatılamadı', { referenceId, error })
    return { delivered: false }
  }
}
