import { MessageCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildWhatsAppUrl } from '@/lib/config/whatsapp'

export async function WhatsAppFab() {
  const url = buildWhatsAppUrl()
  if (!url) return null // numara tanımsız → buton hiç render edilmez
  const t = await getTranslations('common')
  return (
    <a
      aria-label={t('whatsapp')}
      className="fixed right-5 bottom-24 z-40 flex size-13 items-center justify-center rounded-none bg-olive shadow-[var(--shadow-lift)] transition-transform hover:scale-105 lg:bottom-5"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden className="size-6 text-background" />
    </a>
  )
}
