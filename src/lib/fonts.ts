import { Instrument_Serif, Manrope } from 'next/font/google'

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
