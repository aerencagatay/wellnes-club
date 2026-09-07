import { describe, expect, it } from 'vitest'
import { getAllCamps } from '@/content'
import { renderAutoReply, renderInternalNotification } from './templates'
import type { CampInquiry } from '@/lib/utils/validation'

const camp = getAllCamps()[0]
const REF = 'SR-20260731-A7K2'

const inquiry: CampInquiry = {
  kind: 'camp',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+905551112233',
  campSlug: camp.slug,
  guests: 2,
  roomPreference: 'tek-kisilik',
  nights: 2,
  message: 'Vejetaryenim.',
  consent: true,
}

describe('renderInternalNotification', () => {
  const mail = renderInternalNotification(inquiry, REF)

  it('konuda referans numarası ve kamp adı geçer', () => {
    expect(mail.subject).toContain(REF)
    expect(mail.subject).toContain(camp.title.tr)
  })

  it('gövdede tüm form alanları geçer', () => {
    for (const value of [inquiry.name, inquiry.email, inquiry.phone, 'Vejetaryenim.', '2']) {
      expect(mail.text, `${value} eksik`).toContain(value)
    }
  })

  it('oda tercihini okunabilir metne çevirir', () => {
    expect(mail.text).toMatch(/tek kişilik/i)
  })

  it('HTML gövdesinde kullanıcı girdisi kaçırılır', () => {
    const xss = { ...inquiry, name: '<script>alert(1)</script>' }
    expect(renderInternalNotification(xss, REF).html).not.toContain('<script>')
    expect(renderInternalNotification(xss, REF).html).toContain('&lt;script&gt;')
  })
})

describe('renderAutoReply', () => {
  it('katılımcıya referans numarası ve kamp bilgisini yazar', () => {
    const mail = renderAutoReply(inquiry, REF)
    expect(mail.subject).toContain('EDEN Wellness Club')
    expect(mail.text).toContain(REF)
    expect(mail.text).toContain(camp.title.tr)
  })

  it('bülten kaydında kamp bilgisi aramaz', () => {
    const mail = renderAutoReply({ kind: 'newsletter', email: 'a@b.com', consent: true }, REF)
    expect(mail.subject).toBeTruthy()
    expect(mail.text).toContain(REF)
  })

  it('HTML gövdesinde kullanıcı girdisi kaçırılır', () => {
    const xss = { ...inquiry, name: '<script>alert(1)</script>' }
    const mail = renderAutoReply(xss, REF)
    expect(mail.html).not.toContain('<script>')
    expect(mail.html).toContain('&lt;script&gt;')
  })
})
