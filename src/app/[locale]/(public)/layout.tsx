import type { ReactNode } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BackToTop } from '@/components/layout/back-to-top'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { WhatsAppFab } from '@/components/layout/whatsapp-fab'
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
