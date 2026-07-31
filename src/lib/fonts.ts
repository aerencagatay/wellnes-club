import { PT_Serif, Mulish } from 'next/font/google'

export const ptSerif = PT_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-pt-serif',
})

export const mulish = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mulish',
})
