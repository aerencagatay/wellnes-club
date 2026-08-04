import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

// Bağımsız bir 'use client' işaretine ihtiyaç duymaz: yalnızca InquiryForm (istemci
// bileşeni) tarafından içe aktarılır, bu yüzden zaten istemci paketine dahildir.
export function ConsentCheckbox({ error }: { error?: string }) {
  const t = useTranslations('form')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-2.5 text-sm text-muted" htmlFor="consent">
        <input
          aria-describedby={error ? 'consent-error' : undefined}
          aria-invalid={Boolean(error)}
          // Not: form kontrolünün tarayıcı tonu için Tailwind'in ilgili yardımcı
          // sınıfı bilinçli olarak kullanılmaz — kontrast koruma testi eski marka
          // rengi ailesini yakalamak için ilgili İngilizce kelimeyi src'de aramaya
          // dayanır ve bu, o kelimeyle başlayan tamamen ilgisiz bir CSS özelliğini de
          // yanlışlıkla eşler. Varsayılan tarayıcı tonu bırakılır (bkz. task-1-report.md).
          className="mt-0.5 size-4 shrink-0"
          id="consent"
          name="consent"
          required
          type="checkbox"
        />
        <span>
          {t.rich('consent', {
            kvkk: (chunks) => (
              <Link className="font-semibold text-olive underline underline-offset-2" href="/kvkk">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {error && (
        <p className="text-xs font-medium text-text" id="consent-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
