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

  // 'resend' SDK'sının yüklenememesi (paket eksik/bozuk) veya yollarken beklenmedik
  // biçimde patlaması, ziyaretçinin isteğini 500'e düşürmemeli: referans numarası zaten
  // üretildi, talep organizatöre ulaşmasa bile ziyaretçi elinde bir referansla kalmalı.
  try {
    // 'resend' isteğe bağlı bağımlılık; kurulu değilken tsc'nin modül çözümleme
    // hatasını burada bilerek bastırıyoruz. Paket gerçekten kurulduğunda alttaki
    // satır artık hata üretmeyeceği için derleyici bu yönergeyi kullanılmamış
    // sayıp hata verecek — o an bu yorum ve yönerge birlikte kaldırılmalı.
    // @ts-expect-error resend paketi kurulu değil (bkz. yukarıdaki not)
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const results = await Promise.allSettled([
      resend.emails.send({ from: FROM, to, replyTo: input.email, ...internal }),
      resend.emails.send({ from: FROM, to: input.email, ...autoReply }),
    ])

    const failed = results.filter((r) => r.status === 'rejected')
    if (failed.length > 0) {
      console.error('[inquiry] E-posta gönderimi kısmen başarısız', { referenceId, failed })
    }
    // Kurum bildirimi (ilk gönderim) gittiyse teslim edilmiş sayılır — asıl iş
    // organizatörün talebi görmesidir, otomatik yanıtın başarısız olması ikincildir.
    return { delivered: results[0].status === 'fulfilled' }
  } catch (error) {
    console.error('[inquiry] E-posta gönderim katmanı başlatılamadı', { referenceId, error })
    return { delivered: false }
  }
}
