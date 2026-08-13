'use client'

import { motion, type Variants } from 'motion/react'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

type TextAnimateProps = {
  children: string
  className?: string
  /** Parçalar arası gecikme (saniye). */
  stagger?: number
  delay?: number
  duration?: number
  /** Kelime kelime mi harf harf mi bölünsün. */
  by?: 'word' | 'character'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * MagicUI `TextAnimate` — büyük başlıkların sırayla bulanıklıktan çıkarak
 * belirmesi. Ana sayfanın tipografi odaklı hero'sunda marka adı için kullanılır.
 *
 * ERİŞİLEBİLİRLİK NOTU (MagicUI'nin özgün sürümünden sapma): metin parçalara
 * bölündüğünde ekran okuyucular her parçayı ayrı bir sözcük gibi okuyabilir —
 * harf harf bölmede "E-D-E-N" tek tek harfler olarak seslendirilir. Bu yüzden
 * görsel parçalar `aria-hidden` ile gizlenir ve tam metin görsel olarak gizli
 * tek bir `<span>` içinde bir kez sunulur. Böylece görsel efekt korunurken
 * okunan metin bozulmaz.
 */
export function TextAnimate({
  children,
  className,
  stagger = 0.05,
  delay = 0,
  duration = 0.6,
  by = 'word',
  as = 'span',
}: TextAnimateProps) {
  const reduced = useReducedMotion()
  const Tag = as
  const MotionTag = motion[as]

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  // Boşluklar korunarak bölünür: `split(' ')` sonrası aradaki boşluğu ayrı bir
  // düğüm olarak geri koymak yerine her parçaya bir `mr` verilseydi kelimeler
  // arası boşluk font ölçeğinden bağımsız sabitlenirdi.
  const segments = by === 'word' ? children.split(/(\s+)/) : [...children]

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: '0.3em', filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <MotionTag
      animate="visible"
      className={className}
      initial="hidden"
      variants={container}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {segments.map((segment, index) =>
          // Salt boşluk parçaları animasyon almaz — `inline-block` bir boşluğu
          // sıfır genişliğe indirir ve kelimeler birbirine yapışırdı.
          /^\s+$/.test(segment) ? (
            <span key={index}>{segment}</span>
          ) : (
            <motion.span className="inline-block" key={index} variants={item}>
              {segment}
            </motion.span>
          ),
        )}
      </span>
    </MotionTag>
  )
}
