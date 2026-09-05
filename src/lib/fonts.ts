import { Caveat, Fraunces, Inter } from 'next/font/google'

/**
 * TİPOGRAFİ SİSTEMİ — ÜÇ SES (deneysel EDEN zine yönü, 2026-09-05).
 *
 * Sistem `DESIGN.md`'nin iki sesli kurgusunu (editoryal serif + sessiz grotesk)
 * temel alır ve üzerine ÜÇÜNCÜ bir ses ekler: el yazısı aksan. Üçünün işi
 * kesin olarak ayrıdır ve karışmaz:
 *
 *   1. FRAUNCES  → display serif. Marka, bölüm başlıkları, retreat adları.
 *   2. INTER     → grotesk. Navbar, gövde, buton, form, tarih, fiyat, program.
 *   3. CAVEAT    → el yazısı. YALNIZCA aksan: "Move · Breathe · Connect",
 *                  tarih/konum notları, doodle altyazıları. Gövde metni ASLA.
 *
 * POPPINS NEDEN GİTTİ: geometrik bir sanstı ve `DESIGN.md`'nin istediği şey
 * "quiet grotesque" — geometrik sans (dairesel o, tek katlı a) posterin el
 * çizimi diliyle yarışıyor, Inter ise arkaya çekilip yapıyı taşıyor. Inter
 * ayrıca Türkçe için daha geniş bir hinting setine sahip.
 */
export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  // `axes` kullanıldığında `weight` ya hiç verilmemeli ya da 'variable'
  // olmalı — next/font aksi hâlde build'i durdurur ("Axes can only be defined
  // for variable fonts…"). 'variable' zaten istediğimiz şey: ağırlık ekseni
  // sürekli kalır, CSS'te 300–700 arası herhangi bir değer kullanılabilir.
  weight: 'variable',
  // `opsz` (optical size) büyük puntoda kalın/ince kontrastını artırır;
  // başlıklarda kullanıldığı için üst uca yakın değerler tercih edilir.
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-fraunces',
})

/**
 * Sessiz grotesk — sistemin taşıyıcısı. Türkçe için `latin-ext` alt kümesi
 * ZORUNLU: ğ/ş/ı/İ/ç/ö/ü glifleri yalnızca orada geliyor ve eksik glif sitenin
 * her yerinde anında bozuk görünür.
 */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * EL YAZISI AKSAN — posterin ("canakkale-18-20-eylul-2026-duyuru.jpeg") kalemle
 * yazılmış "Yoga Retreat" ve "September 18-20" satırlarının web karşılığı.
 *
 * CAVEAT NEDEN: Google Fonts'taki el yazısı fontlarının ÇOĞUNDA `latin-ext`
 * alt kümesi YOKTUR — ğ/ş/ı/İ/ç glifleri gelmez ve "Yaklaşan Etkinlikler" gibi
 * bir satır anında bozulur. Caveat `latin-ext` taşır, bu yüzden Türkçe aksan
 * metinlerde güvenle kullanılabilir. Buna rağmen kullanım alanı dar tutulur
 * (bkz. globals.css `.type-hand`): el yazısı küçük puntoda ve uzun metinde
 * okunabilirliği düşürür.
 */
export const caveat = Caveat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-caveat',
})
