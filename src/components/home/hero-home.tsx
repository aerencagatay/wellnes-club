import { useTranslations } from 'next-intl'
import { HeroStage } from './hero-stage'

/**
 * HERO — POSTERİN WEB KARŞILIĞI, ÜÇ BOYUTLU BİR SAHNE OLARAK.
 *
 * Kompozisyon doğrudan EDEN'in duyuru posterinden alınmıştır
 * (public/img/poster/canakkale-18-20-eylul-2026-duyuru.jpeg): zeytin alan,
 * tepede turuncu güneş, altında krem "EDEN" ve aralıklı "WELLNESS CLUB", onun
 * altında el yazısıyla bir satır. Sıra ve hiyerarşi birebir aynı; öğelerin
 * DERİNLİĞİ ise `HeroStage`te kuruluyor (bkz. o dosyanın başlığı).
 *
 * FOTOĞRAF YOK, LOGO GÖRSELİ DE YOK — ikisi de bilinçli:
 *
 *   - Fotoğraf: yön "stok yoga görseli" değil, "çağdaş wellness posteri".
 *     Bir fotoğraf hero'yu anında jenerik yapardı.
 *   - Logo görseli (`eden-logo.png`): krem zemin için üretilmiş bir PNG'dir;
 *     zeytin alanın üzerine konduğunda kendi kremi alanla çakışır. Marka adı
 *     bunun yerine CANLI TİPOGRAFİYLE kuruluyor — hem alanla aynı kremi
 *     paylaşır, hem harf harf belirebilir, hem de her ekranda keskin kalır.
 *
 * BU BİLEŞEN SUNUCUDA KALIR: çeviriler burada çözülür ve `HeroStage`e düz
 * dizeler olarak iner, böylece next-intl'in mesaj sözlüğü istemci paketine
 * girmez.
 */
export function HeroHome() {
  const t = useTranslations('home.hero')

  return <HeroStage cta={t('cta')} ctaSecondary={t('ctaSecondary')} handLine={t('handLine')} />
}
