import type { ReactNode } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BackToTop } from '@/components/layout/back-to-top'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { WhatsAppFab } from '@/components/layout/whatsapp-fab'
import { Curtain } from '@/components/motion/curtain'
import { ScrollRail } from '@/components/motion/scroll-rail'
import { SmoothScroll } from '@/components/motion/smooth-scroll'

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  return (
    <>
      <a className="skip-link" href="#main">
        {t('skipToContent')}
      </a>
      {/* Galeri katmanı — ikisi de yalnızca görsel: `aria-hidden`,
          `pointer-events-none` ve hareket azaltma isteğinde hiç render
          edilmiyorlar. Sayfanın işaretlemesine, odak sırasına veya tıklama
          hedeflerine dokunmazlar.

          `GalleryCursor` (fareyi geriden takip eden halka) 2026-09-07'de
          KALDIRILDI (kullanıcı isteği): yerel imleci `cursor: none` ile
          gizleyip yerine kendi halkasını çiziyordu. Sistem imleci geri döndü.
          Yeni bir kaplama eklerken artık en yüksek katman modaldır (z-100);
          halkanın z-200'ü ile yarışmak gerekmiyor. */}
      <ScrollRail />
      <Curtain />
      <Navbar />
      <main id="main">
        <SmoothScroll>{children}</SmoothScroll>
      </main>
      <Footer />
      <WhatsAppFab />
      <BackToTop />
    </>
  )
}
