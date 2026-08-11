import { Instrument_Serif, Manrope, Montserrat } from 'next/font/google'

// Instrument Serif yalnızca 400 ağırlığında yayınlanıyor. Başlıklarda
// font-bold/semibold kullanmayın — tarayıcı taklit-bold üretir.
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-manrope',
})

// Logonun ince, geniş harf aralıklı geometrik sans-serif'iyle eşleşir (bkz.
// EDEN LOGO.jpeg) — başlıklarda ExtraLight/Light ağırlıklar kullanılır.
export const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500'],
  display: 'swap',
  variable: '--font-montserrat',
})
