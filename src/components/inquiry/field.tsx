import type { ReactNode } from 'react'

export function Field({
  label,
  htmlFor,
  error,
  hint,
  className = '',
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  /** Izgara içinde alanın kaç kolon kaplayacağı gibi yerleşim sınıfları için. */
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[11px] font-bold tracking-[0.16em] text-text uppercase" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        /* Hata rengi DEĞİL, İŞARET: kırmızı metin bu paletin dışında kalıyor
           ve krem üzerinde zayıf okunuyordu. Sarı highlighter zemini (siyah
           metinle 15.6:1) hatayı renk körlüğünden bağımsız olarak da öne
           çıkarır — vurgu renkte değil, zeminde. */
        <p className="self-start bg-yellow px-2 py-1 text-xs font-semibold text-text" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// KESKİN KÖŞELİ, HAIRLINE ÇERÇEVELİ ALAN — zine/galeri sisteminin form dili
// (2026-09-05). Alan bir "kutu" değil, kağıda çizilmiş bir çerçevedir; sistemde
// tek eğri pill butondadır.
//
// Odakta hem kenarlık zeytine döner hem de görünür bir outline korunur —
// yalnızca renk değişimine güvenmek erişilebilirlik açısından yetersizdir.
// Zemin `--color-paper` (en açık kağıt): krem sayfa üzerinde alanın nerede
// başladığını hairline'a ek olarak ton farkıyla da gösterir.
export const inputClass =
  'w-full border border-text bg-paper px-4 py-3 text-text transition-all duration-200 ease-out placeholder:text-muted focus:border-olive focus:outline-2 focus:outline-offset-1 focus:outline-olive'

/**
 * `Field` yukarıda hata/hint paragraflarının kimliğini `${htmlFor}-error` /
 * `${htmlFor}-hint` olarak üretir. Alanın kendisi (input/select/textarea) bu kimliğe
 * `aria-describedby` ile bağlanmazsa ekran okuyucu kullanıcısı hatayı asla duymaz — bu
 * yardımcı o eşleşmeyi TEK bir yerde tutar, her alanda elle tekrarlanan
 * `error ? 'x-error' : hint ? 'x-hint' : undefined` mantığının bir kopyasının
 * unutulup tutarsızlık yaratmasını önler. Hata her zaman hint'ten önceliklidir —
 * `Field` da hint'i `!error` koşuluyla gizler, burası onunla senkron.
 */
export function fieldDescribedBy(htmlFor: string, options: { error?: string; hint?: string } = {}): string | undefined {
  if (options.error) return `${htmlFor}-error`
  if (options.hint) return `${htmlFor}-hint`
  return undefined
}
