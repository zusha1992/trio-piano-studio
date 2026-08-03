import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CONTACTS, MAPS_URL } from '@/data/contact';
import { pageMetadata } from '@/lib/seo';
import { pick, type Locale } from '@/lib/i18n';

// Required by regulation 35 of the Equal Rights for Persons with Disabilities
// (Service Accessibility Adjustments) Regulations: a statement of the level of
// accessibility, what was done, how it was tested, and how to reach the
// accessibility coordinator.
//
// TODO (client): name a person as accessibility coordinator and set
// ACCESSIBILITY_COORDINATOR below — the regulation asks for a named contact.
const ACCESSIBILITY_COORDINATOR = {
  name: { he: 'נועם שוחט', en: 'Noam Shohat', ar: 'نوعام شوحط', ru: 'Ноам Шохат' },
};

const LAST_UPDATED = '2026-08-02';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const [t, tMeta] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'accessibility' }),
    getTranslations({ locale: params.locale, namespace: 'meta' }),
  ]);
  return pageMetadata({
    locale: params.locale,
    path: '/accessibility',
    title: t('title'),
    description: t('compliance'),
    siteName: tMeta('site_name'),
  });
}

export default async function AccessibilityStatementPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'accessibility' });

  const phone = CONTACTS.find((c) => c.icon === 'whatsapp.svg');
  const email = CONTACTS.find((c) => c.icon.startsWith('envelope'));
  const address = CONTACTS.find((c) => c.icon.startsWith('location'));

  const sections = [
    { title: t('compliance_title'), body: t('compliance') },
    { title: t('measures_title'), body: t('measures') },
    { title: t('tested_title'), body: t('tested') },
    { title: t('limits_title'), body: t('limits') },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-32 sm:px-10 md:pt-44 lg:pt-52">
      <h1 className="text-4xl leading-tight tracking-tight text-[var(--c-text)] sm:text-5xl">
        {t('title')}
      </h1>

      <p className="mt-8 text-base leading-relaxed text-[var(--c-text)] sm:text-lg">{t('intro')}</p>

      {sections.map((s) => (
        <div key={s.title} className="mt-10">
          <h2 className="text-xl tracking-tight text-[var(--c-text)]">{s.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--c-muted)]">{s.body}</p>
        </div>
      ))}

      <div className="mt-10">
        <h2 className="text-xl tracking-tight text-[var(--c-text)]">{t('contact_title')}</h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--c-muted)]">{t('contact')}</p>

        <dl className="mt-5 space-y-2 text-base text-[var(--c-text)]">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-[var(--c-dim)]">{t('coordinator')}:</dt>
            <dd>{pick(ACCESSIBILITY_COORDINATOR.name, locale)}</dd>
          </div>
          {phone && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-[var(--c-dim)]">☎</dt>
              <dd>
                <a href="tel:+972543337341" className="underline underline-offset-4" dir="ltr">
                  {pick(phone.label, locale)}
                </a>
              </dd>
            </div>
          )}
          {email && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-[var(--c-dim)]">@</dt>
              <dd>
                <a href={email.href} className="underline underline-offset-4" dir="ltr">
                  {pick(email.label, locale)}
                </a>
              </dd>
            </div>
          )}
          {address && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-[var(--c-dim)]">⌖</dt>
              <dd>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {pick(address.label, locale)}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <p className="mt-12 text-sm text-[var(--c-dim)]">
        {t('updated')}: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
      </p>
    </section>
  );
}
