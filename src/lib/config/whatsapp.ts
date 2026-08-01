function rawNumber(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^\d]/g, '')
}

export function isWhatsAppEnabled(): boolean {
  return rawNumber().length > 0
}

/** Numara tanımsızsa null döner — çağıran taraf bağlantıyı hiç göstermez. */
export function buildWhatsAppUrl(message?: string): string | null {
  const number = rawNumber()
  if (!number) return null
  const trimmed = message?.trim()
  if (!trimmed) return `https://wa.me/${number}`
  return `https://wa.me/${number}?text=${encodeURIComponent(trimmed)}`
}
