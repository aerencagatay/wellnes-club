import { Fraunces, Poppins } from 'next/font/google'

/**
 * TİPOGRAFİ SİSTEMİ — logodan türetilmiştir (kullanıcı isteği, 2026-08-14).
 *
 * Logo zaten iki fontlu bir sistem öneriyor: "EDEN" yuvarlak, şişkin gövdeli
 * 70'ler groovy serif; "WELLNESS CLUB" geniş aralıklı geometrik sans. Site
 * eskiden Montserrat ExtraLight + Manrope kullanıyordu — zarif ama nötr, ve
 * logoyla hiçbir akrabalığı yoktu.
 *
 * FRAUNCES NEDEN SEÇİLDİ: değişken (variable) bir font ve `SOFT` ile `WONK`
 * eksenlerini taşıyor. `SOFT` köşe yumuşaklığını, `WONK` ise "eğri büğrü"
 * karakteri (tek katlı a/g formları, eğik terminaller) kontrol ediyor. Yani
 * groovy'lik SABİT değil, AYARLANABİLİR — sabit bir display font ya tutar ya
 * tutmaz, burada dozu geri çekebiliyoruz (bkz. globals.css'teki
 * `font-variation-settings`).
 *
 * KULLANIM SINIRI — ÖNEMLİ: Fraunces bir DISPLAY fontudur. Yalnızca
 * `.type-display` ve `.type-title` gibi büyük başlıklarda kullanılır. Gövde
 * metni, butonlar, form alanları ve tablolar Poppins kalır: dekoratif serifler
 * küçük puntoda ve uzun metinde okunabilirliği düşürür.
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
 * Geometrik sans — logonun "WELLNESS CLUB" satırının karşılığı. Türkçe için
 * `latin-ext` alt kümesi ZORUNLU: ğ/ş/ı/İ/ç/ö/ü glifleri yalnızca orada
 * geliyor ve eksik glif sitenin her yerinde anında bozuk görünür.
 */
export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-poppins',
})
