import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { sendInquiryEmails } from '@/lib/mail'
import { generateReferenceId } from '@/lib/utils/ids'
import { flattenZodErrors, inquirySchema } from '@/lib/utils/validation'

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
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
