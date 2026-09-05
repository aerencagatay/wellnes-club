import type { Teacher } from './types'

/**
 * GERÇEK VERİ (kullanıcı kararı, 2026-09-05): kadro tek bir isme indirildi —
 * Melike Göktan, 18-20 Eylül 2026 Asos Yoga Retreat'in hocası.
 *
 * Önceki üç kayıt (`elif-demir`, `can-yilmaz`, `zeynep-arslan`) tamamen
 * kurgusaldı ve kaldırıldı; `elif-demir`'in stok fotoğrafı da öyle.
 *
 * BURADA NEDEN YALNIZCA AD, UNVAN VE DİSİPLİN VAR: Melike Göktan gerçek bir
 * kişidir. `bio` ve `certifications` alanları, kendisinden doğrulanmış bilgi
 * gelene kadar BİLİNÇLİ OLARAK BOŞ bırakılmıştır — bir eğitmen adına özgeçmiş
 * ya da sertifika uydurmak (önceki kayıtlardaki "Yoga Alliance RYT-500" gibi)
 * gerçek bir insan için yanlış mesleki beyanda bulunmak olurdu. Arayüz bu
 * alanlar yokken ilgili bölümü hiç render etmez, boş başlık göstermez.
 *
 * `photo` da yok: fotoğraf kullanıcı isteğiyle kaldırıldı (2026-09-05).
 * `TeacherPortrait` bu durumda isimden türetilmiş bir monogram gösterir —
 * yerine stok bir fotoğraf konmaz.
 *
 * Gerçek bilgi geldiğinde: `bio`, `certifications`, `photo` ve `instagram`
 * alanlarını doldurmak yeterli; başka hiçbir yerde değişiklik gerekmez.
 */
export const teachers: Teacher[] = [
  {
    slug: 'melike-goktan',
    name: 'Melike Göktan',
    title: { tr: 'Yoga Eğitmeni', en: 'Yoga Teacher' },
    disciplines: ['yoga'],
  },
]
