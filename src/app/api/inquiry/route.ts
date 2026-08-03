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
 *   1. `x-vercel-forwarded-for` — YALNIZCA istek gerçekten Vercel'in altyapısından
 *      geçtiğinde güvenilirdir (Vercel bu başlığı kendi gözlemiyle üzerine yazar).
 *      Bunun dışında istemcinin serbestçe ayarlayabileceği sıradan bir başlıktır —
 *      hatta `X-Forwarded-For`/`X-Real-IP`'in aksine, sıradan ters proxy yazılımları
 *      bu Vercel'e özgü adı tanımadığı ve normalize/temizlemediği için ORADA bile daha
 *      risklidir. Bu yüzden yalnızca `process.env.VERCEL === '1'` (Vercel'in çalışma
 *      zamanına enjekte ettiği standart sinyal) iken dikkate alınır; aksi halde bu dal
 *      tamamen atlanır. Segmentin ilk parçası alınıyor — biçimin sözleşmeli olduğuna
 *      dair resmi bir garanti bulamadık, bu yüzden savunmacı davranıyoruz; tek bir
 *      değer olduğu durumda bunun bir maliyeti yok.
 *   2. `x-real-ip` — tipik olarak güvenilir bir ters proxy tarafından ayarlanır.
 *   3. `x-forwarded-for` zincirinin SON halkası — en yakın güvenilir proxy'nin
 *      eklediği değer (ilk halka değil).
 *   4. `'unknown'`.
 *
 * ÖNEMLİ — dağıtım varsayımı: bu sıralamanın tamamı, isteğin istemciyle uygulama
 * arasında en az bir güvenilir katmandan (Vercel'in kenarı ya da eşdeğer bir ters
 * proxy) geçtiğini varsayar. Tamamen açık bir origin'de (aradaki hiçbir katman
 * güvenilir değilse) başlık tabanlı IP tespitinin hiçbir biçimi saldırganı gerçek
 * kaynaktan ayırt edemez — bu, bu koda özgü bir eksiklik değil, tekniğin doğasıdır.
 * O topolojide asıl savunma `TURNSTILE_SECRET_KEY` ve Upstash'i yapılandırmaktır.
 */
function clientIp(request: Request): string {
  if (process.env.VERCEL === '1') {
    const vercelForwarded = request.headers.get('x-vercel-forwarded-for')
    const vercelIp = vercelForwarded?.split(',')[0]?.trim()
    if (vercelIp) return vercelIp
  }

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
    const { delivered } = await sendInquiryEmails(parsed.data, referenceId)
    // `delivered` ziyaretçiye giden 200 yanıtını ASLA değiştirmez — referans numarası
    // zaten üretildi ve ziyaretçi tarafında form her koşulda "başarılı" görünür (bkz.
    // mail/index.ts'teki tasarım notu). Burada yalnızca üretim loglarında "gerçekten
    // gönderildi" ile "sessizce loglandı" arasındaki farkı ayırt edilebilir kılmak için
    // ayrı bir seviyede logluyoruz — `sendInquiryEmails` zaten kendi içinde
    // `console.error` ile ayrıntı basıyor, bu yalnızca tarama için ek bir sinyal.
    if (!delivered) {
      console.warn('[inquiry] E-posta teslim edilmedi (delivered: false)', { referenceId })
    }

    return NextResponse.json({ ok: true, referenceId }, { status: 200 })
  } catch (error) {
    console.error('[inquiry] Beklenmeyen hata', error)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
