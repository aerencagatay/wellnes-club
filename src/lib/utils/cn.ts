import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * MagicUI bileşenlerinin tamamı bu yardımcıyı bekler (kütüphanenin standart
 * konvansiyonu). `clsx` koşullu sınıfları çözer, `twMerge` çakışan Tailwind
 * yardımcılarında sonuncuyu kazandırır — böylece bir çağıran `className` ile
 * bileşenin kendi varsayılanını gerçekten ezebilir (düz şablon dizesi
 * birleştirmede `px-8 px-10` ikisi de kalır ve hangisinin kazandığı CSS
 * kaynak sırasına düşerdi).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
