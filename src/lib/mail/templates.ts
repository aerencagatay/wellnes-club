import { getCampBySlug } from '@/content'
import { site } from '@/lib/config/site'
import { formatDateRange } from '@/lib/utils/dates'
import type { InquiryInput } from '@/lib/utils/validation'
import type { RenderedMail } from './types'

/**
 * Ad, e-posta ve mesaj gibi serbest metin alanları saldırgan tarafından kontrol
 * edilebilir ve organizatörün açacağı bir HTML e-postasına gömülür — bu yüzden
 * HTML gövdesine giren HER değer buradan geçmeli. Düz metin gövdede kaçırmaya
 * gerek yok (e-posta istemcileri düz metni HTML olarak yorumlamaz).
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Başvurunun (kamp, oda tipi, gece) üçlüsüne karşılık gelen kişi başı fiyat.
 *
 * Doğrulama bu üçlünün gerçek bir kademe olduğunu zaten garantiliyor
 * (bkz. validation.ts → superRefine), ama e-posta şablonu doğrulamadan
 * bağımsız çalışabilmeli: kademe bulunamazsa uydurma bir sayı yazmak yerine
 * `undefined` döner ve çağıran bunu açıkça belirtir.
 */
function tierPrice(input: { campSlug: string; roomPreference: 'paylasimli' | 'tek-kisilik'; nights: number }): string | undefined {
  const camp = getCampBySlug(input.campSlug)
  if (!camp) return undefined
  const occupancy = input.roomPreference === 'paylasimli' ? 'double' : 'single'
  const tier = camp.priceTiers.find((t) => t.nights === input.nights && t.occupancy === occupancy)
  // Para birimi KAMPTA tutuluyor, kademede değil (bkz. content/types.ts).
  return tier ? `${tier.price.toLocaleString('tr-TR')} ${camp.currency}` : undefined
}

const ROOM_LABEL: Record<string, string> = {
  paylasimli: 'Paylaşımlı oda',
  'tek-kisilik': 'Tek kişilik oda',
}

function campLine(input: InquiryInput): string {
  if (input.kind !== 'camp') return ''
  const camp = getCampBySlug(input.campSlug)
  if (!camp) return input.campSlug
  return `${camp.title.tr} (${formatDateRange(camp.startDate, camp.endDate, 'tr')})`
}

function toHtml(lines: string[]): string {
  return `<div style="font-family:system-ui,sans-serif;color:#221c25;line-height:1.6">
${lines.map((line) => `<p style="margin:0 0 8px">${line}</p>`).join('\n')}
</div>`
}

/**
 * Organizatöre giden bildirim. `input` HER ZAMAN `parsed.data`'dan (zod çıktısı)
 * gelmeli, ham istek gövdesinden değil — zod nesne şemaları bilinmeyen alanları
 * atar, ham gövde ise çağıranın gönderdiği her şeyi taşıyabilir. Ham gövdeyi
 * buraya vermek saldırgana e-posta gövdesine keyfi alan enjekte etme imkânı verir.
 */
export function renderInternalNotification(input: InquiryInput, referenceId: string): RenderedMail {
  const rows: [string, string][] = [['Referans', referenceId], ['Tür', input.kind]]

  if (input.kind === 'camp') {
    rows.push(
      ['Kamp', campLine(input)],
      ['Ad Soyad', input.name],
      ['E-posta', input.email],
      ['Telefon', input.phone],
      ['Kişi sayısı', String(input.guests)],
      ['Oda tercihi', ROOM_LABEL[input.roomPreference]],
      // GECE SAYISI VE KARŞILIK GELEN FİYAT: kampın fiyatı oda tipi × gece
      // sayısı ile belirlendiği için ikisi olmadan e-posta hangi paketin
      // istendiğini söylemiyordu. Fiyat `priceTiers`'ten OKUNUR, elle
      // yazılmaz — tek kaynak orası.
      ['Gece sayısı', String(input.nights)],
      ['Kademe fiyatı', tierPrice(input) ?? 'kademe bulunamadı'],
      ['Mesaj', input.message?.trim() || '—'],
    )
  } else if (input.kind === 'contact') {
    rows.push(['Ad Soyad', input.name], ['E-posta', input.email], ['Mesaj', input.message])
  } else {
    rows.push(['E-posta', input.email])
  }

  const subjectSuffix = input.kind === 'camp' ? ` — ${campLine(input)}` : ` — ${input.kind}`

  return {
    subject: `[${referenceId}] Yeni talep${subjectSuffix}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: toHtml(rows.map(([label, value]) => `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}`)),
  }
}

export function renderAutoReply(input: InquiryInput, referenceId: string): RenderedMail {
  const greeting = 'name' in input ? `Merhaba ${input.name},` : 'Merhaba,'

  const lines =
    input.kind === 'newsletter'
      ? [
          greeting,
          'Bültenimize kaydolduğunuz için teşekkürler. Yeni kamp tarihlerini ilk siz duyacaksınız.',
          `Referans numaranız: ${referenceId}`,
        ]
      : [
          greeting,
          input.kind === 'camp'
            ? `${campLine(input)} kampı için talebinizi aldık.`
            : 'Mesajınızı aldık.',
          'En kısa sürede, genellikle bir iş günü içinde size dönüyoruz.',
          `Referans numaranız: ${referenceId}`,
          `Acele bir sorunuz varsa ${site.email} adresinden yazabilirsiniz.`,
        ]

  return {
    subject: `${site.name} — talebinizi aldık (${referenceId})`,
    text: [...lines, '', site.name].join('\n'),
    html: toHtml([...lines.map(escapeHtml), `<em>${escapeHtml(site.name)}</em>`]),
  }
}
