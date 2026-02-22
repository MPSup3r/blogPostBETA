import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. In Next.js 15 requestLocale è una Promise, quindi la attendiamo con await
  let locale = await requestLocale;

  // 2. Fallback di sicurezza: se per qualche motivo non c'è una lingua, forziamo l'italiano
  if (!locale) {
    locale = 'it';
  }

  return {
    locale, // 3. Ora è obbligatorio dichiarare esplicitamente la lingua che stiamo usando
    messages: (await import(`./messages/${locale}.json`)).default
  };
});