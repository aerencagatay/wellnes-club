/** Crockford benzeri alfabe: 0/O, 1/I, 8/B karışıklığı yaratan harfler dışarıda. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ234567'

/**
 * Durumsuz referans numarası. Veritabanı olmadığı için artan sayaç kullanılamaz;
 * tarih insan okunabilirliği, rastgele son ek çakışma önlemeyi sağlar. Bu değer
 * yalnızca yazışmada referanstır, sistemde bir kaydı işaret etmez.
 */
export function generateReferenceId(now: Date): string {
  const date = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('')

  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('')

  return `SR-${date}-${suffix}`
}
