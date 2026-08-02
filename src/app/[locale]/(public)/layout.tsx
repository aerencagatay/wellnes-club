import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { BackToTop } from '@/components/layout/back-to-top'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { WhatsAppFab } from '@/components/layout/whatsapp-fab'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('common')
  return (
    <>
      <a className="skip-link" href="#main">
        {t('skipToContent')}
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
      <BackToTop />
    </>
  )
}
