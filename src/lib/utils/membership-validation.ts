/**
 * =============================================================================
 * ÜYELİK BAŞVURUSU — İSTEMCİ TARAFI DOĞRULAMA
 * =============================================================================
 * Üyelik formunun ARKA UCU YOKTUR (kullanıcı kararı, 2026-09-05: özellik rafa
 * kaldırıldı, sayfa yalnızca arayüz olarak duracak). Bu yüzden doğrulama
 * `validation.ts`teki zod şemalarına EKLENMEDİ: oradaki şemalar `/api/inquiry`
 * uç noktasının sözleşmesidir ve her biri `flattenZodErrors` üzerinden sunucu
 * hata anahtarlarına bağlanır. Gönderilmeyen bir formu o sözleşmeye eklemek,
 * var olmayan bir uç noktanın girdisini API şeması gibi göstermek olurdu.
 *
 * Bunun yerine burada saf, bağımsız bir fonksiyon var. ARKA UÇ BAĞLANDIĞINDA
 * bu dosya ya zod'a taşınır ya da olduğu gibi sunucuda da çağrılır — fonksiyon
 * saf olduğu için ikisi de mümkün.
 *
 * Dönen değerler ÇEVİRİ ANAHTARLARIDIR, cümle değil: metinler
 * messages/{tr,en}.json → `membership.errors` altında yaşar, böylece form iki
 * dilde de doğru hata gösterir.
 */

export type MembershipDraft = {
  firstName: string
  lastName: string
  email: string
  phone: string
  /** Ham `<input type="number">` değeri — bilinçli olarak `string`. */
  age: string
  gender: string
  yogaLevel: string
}

export type MembershipErrorKey =
  | 'required'
  | 'nameTooShort'
  | 'invalidEmail'
  | 'invalidPhone'
  | 'invalidAge'

/**
 * Yaş sınırları. Alt sınır 18: EDEN retreat'leri yetişkin programlarıdır ve
 * reşit olmayan birinden kişisel veri toplamak ayrı bir hukuki rejime
 * (veli onayı) girer. Üst sınır 95, yazım hatalarını (ör. 190) yakalamak için.
 */
export const MEMBERSHIP_AGE_MIN = 18
export const MEMBERSHIP_AGE_MAX = 95

/**
 * E-posta deseni KASITLI OLARAK GEVŞEK: `@` ve bir nokta içeren, boşluksuz bir
 * dize. RFC 5322'yi tam uygulayan bir regex hem okunamaz hem de pratikte
 * gerçek adresleri reddetmesiyle ünlüdür. İstemci doğrulamasının işi yazım
 * hatasını yakalamak; adresin gerçekten var olduğunu yalnızca gönderilen bir
 * e-posta kanıtlar.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Telefon: hem Türkiye hem uluslararası biçimler kabul edilir (prompt
 * §Membership Form Validation). Bu yüzden BİÇİM değil, İÇERİK denetlenir —
 * yalnızca rakam, boşluk ve ayraç karakterleri bulunsun ve en az 7 rakam
 * olsun. `+90 538 048 04 28`, `05380480428` ve `+1 (415) 555-0123` üçü de
 * geçerlidir. Katı bir Türkiye deseni yurt dışından başvuranı dışarıda
 * bırakırdı.
 */
const PHONE_ALLOWED_RE = /^[\d\s+()./-]+$/
const MIN_PHONE_DIGITS = 7

export function validateMembership(
  draft: MembershipDraft,
): Partial<Record<keyof MembershipDraft, MembershipErrorKey>> {
  const errors: Partial<Record<keyof MembershipDraft, MembershipErrorKey>> = {}

  const firstName = draft.firstName.trim()
  if (firstName.length === 0) errors.firstName = 'required'
  else if (firstName.length < 2) errors.firstName = 'nameTooShort'

  const lastName = draft.lastName.trim()
  if (lastName.length === 0) errors.lastName = 'required'
  else if (lastName.length < 2) errors.lastName = 'nameTooShort'

  const email = draft.email.trim()
  if (email.length === 0) errors.email = 'required'
  else if (!EMAIL_RE.test(email)) errors.email = 'invalidEmail'

  const phone = draft.phone.trim()
  const phoneDigits = phone.match(/\d/g)?.length ?? 0
  if (phone.length === 0) errors.phone = 'required'
  else if (!PHONE_ALLOWED_RE.test(phone) || phoneDigits < MIN_PHONE_DIGITS) errors.phone = 'invalidPhone'

  const age = draft.age.trim()
  if (age.length === 0) {
    errors.age = 'required'
  } else {
    // `Number()` kullanılır, `parseInt` DEĞİL: `parseInt('25abc')` sessizce 25
    // döndürür ve bozuk girdiyi geçerli sayar. `Number('25abc')` NaN verir.
    const parsed = Number(age)
    if (!Number.isInteger(parsed) || parsed < MEMBERSHIP_AGE_MIN || parsed > MEMBERSHIP_AGE_MAX) {
      errors.age = 'invalidAge'
    }
  }

  if (draft.gender.trim().length === 0) errors.gender = 'required'
  if (draft.yogaLevel.trim().length === 0) errors.yogaLevel = 'required'

  return errors
}
