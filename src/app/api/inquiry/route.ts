import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { sendInquiryEmails } from '@/lib/mail'
import { generateReferenceId } from '@/lib/utils/ids'
import { flattenZodErrors, inquirySchema } from '@/lib/utils/validation'

/**
 * Next.js 15+ `NextRequest`'ten `.ip`/`.geo`'yu kaldırdı (bkz. Next.js 15 yükseltme
 * notları) — bu değerlerin barındırma sağlayıcısı tarafından sağlanması bekleniyor.
 * Vercel'de resmi karşılığı `@vercel/functions`'ın `ipAddress()` fonksiyonudur, ama bu
 * planın onayladığı üç bağımlılığın (Upstash x2, Resend) dışında yeni bir paket
 * gerektirir; bu yüzden aynı önceliği burada başlık okuyarak elle uyguluyoruz.
 *
 * `X-Forwarded-For` eklemeli bir zincirdir: her ara katman kendi gördüğü eşi zincirin
 * SONUNA ekler. İLK halka bağlanan istemcinin İDDİA ettiği değerdir — güvenilir bir ara
 * katman yoksa saldırgan bunu her istekte değiştirerek sınırsız yeni "IP" üretebilir ve
 * hız sınırını atlar. Bu yüzden ilk halkaya asla güvenilmez; öncelik sırası:
 *   1. `x-vercel-forwarded-for` — Vercel'in kenarı tarafından enjekte edilir, istemci
 *      tarafından ayarlanamaz (plan dağıtım hedefi Vercel'dir).
 *   2. `x-real-ip` — tipik olarak güvenilir bir ters proxy tarafından ayarlanır.
 *   3. `x-forwarded-for` zincirinin SON halkası — en yakın güvenilir proxy'nin
 *      eklediği değer (ilk halka değil).
 *   4. `'unknown'`.
 */
function clientIp(request: Request): string {
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for')
  const vercelIp = vercelForwarded?.split(',')[0]?.trim()
  if (vercelIp) return vercelIp

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwarded = request.headers.get('x-forwarded-for')
  const hops = forwarded
    ?.split(',')
    .map((hop) => hop.trim())
    .filter(Boolean)
  if (hops && hops.length > 0) return hops[hops.length - 1]

  return 'unknown'
}

export async function POST(request: Request) {
  const ip = clientIp(request)

  try {
    const { allowed } = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, errors: { form: 'generic' } }, { status: 400 })
    }

    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: flattenZodErrors(parsed.error) }, { status: 400 })
    }

    const isHuman = await verifyTurnstile(parsed.data.turnstileToken, ip)
    if (!isHuman) {
      return NextResponse.json({ ok: false, errors: { form: 'generic' } }, { status: 400 })
    }

    const referenceId = generateReferenceId(new Date())
    await sendInquiryEmails(parsed.data, referenceId)

    return NextResponse.json({ ok: true, referenceId }, { status: 200 })
  } catch (error) {
    console.error('[inquiry] Beklenmeyen hata', error)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
