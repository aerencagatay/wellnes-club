import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'

// Bilinmeyen bir yola (ör. /tr/olmayan-sayfa) her istek — programatik `notFound()`
// çağrısı olmadan — bu dosyayı render eder. `params` burada KASITLI olarak alınmaz:
// tamamen eşleşmeyen bir rota için Next.js'in üst düzey dinamik segment değerlerini
// (locale gibi) buraya iletmesi garanti değildir. `getTranslations` yerine bunun
// yerine next-intl'in istek bazlı locale bağlamına (proxy.ts'teki middleware'in
// negotiate ettiği) güvenir, bu da (public)/layout.tsx üzerinden gelen Navbar/Footer
// için zaten aynı mekanizmadır.
export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="type-title">{t('title')}</h1>
        <p className="type-lede mt-5">{t('body')}</p>
        <div className="mt-10 flex justify-center gap-4">
          <Button href="/">{t('home')}</Button>
          <Button href="/kamplar" variant="ghost">
            {t('camps')}
          </Button>
        </div>
      </div>
    </Section>
  )
}
