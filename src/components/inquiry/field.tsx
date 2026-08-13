import type { ReactNode } from 'react'

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-text" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs font-medium text-text" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Kutulu, yuvarlatılmış input. Eskiden tek bir alt çizgiydi (Task 8 brief §3)
// — o dil, siteyi "2010'lar" hissine iten keskin/çizgisel kontrol ailesinin
// parçasıydı ve kullanıcı isteğiyle 2026-08-14'te terk edildi. Kutulu alan
// ayrıca dokunmatik hedefi görsel olarak netleştirir: tıklanabilir alanın
// nerede başlayıp bittiği alt çizgide belirsizdi.
//
// Odakta hem kenarlık zeytine döner hem de görünür bir outline korunur —
// yalnızca renk değişimine güvenmek erişilebilirlik açısından yetersizdir.
export const inputClass =
  'w-full rounded-[var(--radius-btn)] border border-text/15 bg-background/70 px-4 py-3 text-text transition-all duration-200 ease-out placeholder:text-muted hover:border-text/25 focus:border-olive focus:bg-background focus:outline-2 focus:outline-offset-1 focus:outline-olive'

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
