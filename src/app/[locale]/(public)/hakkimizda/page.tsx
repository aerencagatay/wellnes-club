import { Check } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { PageHero } from '@/components/layout/page-hero'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Section } from '@/components/ui/section'
import { buildAlternates } from '@/lib/seo/metadata'

const APPROACH_ITEMS = ['1', '2', '3'] as const

/**
 * HAKKIMIZDA — EDEN BİR ORGANİZASYON MARKASIDIR.
 *
 * Bu sayfa 2026-09-06'da yeniden yazıldı (kullanıcı kararı). Önceki hâli
 * kulübü TEK BİR TAŞ OTELE bağlıyordu: giriş cümlesi "aynı taş otelde, aynı
 * küçük ekiple" diyordu, hikâye otelin adını veriyor ve "kamplarımızı o
 * günden beri aynı otelde düzenliyoruz" diye sürüyordu; yaklaşım maddelerinden
 * biri "aynı otel"i bir vaat olarak sayıyordu; ayrı bir bölüm de hocaları
 * "EKİBİMİZ / Hocalarımız" başlığıyla sunuyordu.
 *
 * İKİSİ DE YANLIŞ BİR AİDİYET KURUYORDU. EDEN otel işletmiyor ve eğitmen
 * çalıştırmıyor. Mekânlar ve hocalar BAĞIMSIZDIR; her retreat için ayrı
 * seçilir ve iş ortağı olarak yer alırlar. Bir işletmeyi veya bir kişiyi
 * kendi bünyenizin parçası gibi göstermek, ziyaretçiye kimin neyden sorumlu
 * olduğu konusunda yanlış bilgi vermektir — sitenin içerik dürüstlüğü
 * kuralının (bkz. eden-design-system skill §6) doğrudan konusudur.
 *
 * "NEDEN ASSOS" BÖLÜMÜ DE KALDIRILDI (2026-09-07): Assos ve içindeki otel
 * EDEN'in TEMASI DEĞİL, yalnızca 18-20 Eylül 2026 etkinliğinin lokasyonu.
 * Kulüp İstanbul çevresi, Ege ve Akdeniz'de çalışıyor; kurumsal sayfanın
 * yarısını tek bir yeri savunmaya ayırmak kapsamı olduğundan dar gösteriyordu.
 * Assos artık yalnızca ait olduğu yerde görünüyor: o etkinliğin detay
 * sayfasında (`CampDetailHero` ve `VenueLocation`).
 *
 * `TeachersPreview` bölümü de bu yüzden KALDIRILDI. Ayrıca bileşen zaten
 * silinmiş sayfalara (`/hocalar` ve `/hocalar/[slug]`) bağlantı veriyordu —
 * yani sayfada üç kırık bağlantı vardı; alttaki CTA da silinmiş `/iletisim`'e
 * gidiyordu.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('hakkimizda.title'),
    description: t('hakkimizda.description'),
    alternates: buildAlternates(`/${locale}/hakkimizda`),
  }
}

export default async function AboutPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} lede={t('lede')} title={t('title')} />

      {/* ÜÇ PARAGRAF, TEK KOLON, DAR ÖLÇÜ (kullanıcı metni, 2026-09-07).
          İki kolonluk eski düzen iki paragraf içindi; üç paragrafta son
          paragrafı yalnız bırakıyordu. Tek kolon + `max-w-2xl`, satır uzunluğunu
          da okunur aralıkta tutuyor — geniş bir kapta `type-lede` 120 karaktere
          çıkıyordu. */}
      <Section>
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="type-lede">{t('storyBody1')}</p>
          <p className="type-lede">{t('storyBody2')}</p>
          <p className="type-lede">{t('storyBody3')}</p>
        </div>
      </Section>

      <Section background="surface">
        <div className="max-w-xl">
          <Eyebrow>{t('approachEyebrow')}</Eyebrow>
          <h2 className="type-title">{t('approachTitle')}</h2>
        </div>
        <ul className="mt-10 flex flex-col gap-6">
          {APPROACH_ITEMS.map((item) => (
            <li className="flex items-start gap-4" key={item}>
              <Check aria-hidden className="mt-1 size-5 shrink-0 text-olive" />
              {/* text-muted: bu bölüm cream-2 zemininde, düz gövde metni orada WCAG
                  AA eşiğinin altında kalır (bkz. globals.css'teki --color-muted token yorumu). */}
              <p className="text-base text-muted">{t(`approachItems.${item}`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="type-title">{t('ctaTitle')}</h2>
          <p className="type-lede mt-4">{t('ctaBody')}</p>
          <div className="mt-8">
            {/* `/iletisim` SİLİNDİ (site üç sayfaya indirildi); bu düğme onu
                işaret etmeye devam ediyordu ve 404 veriyordu. Hedef, sitede
                gerçekten çalışan tek iletişim yolu olan başvuru formu. */}
            <Button href="/basvuru">{t('ctaButton')}</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
