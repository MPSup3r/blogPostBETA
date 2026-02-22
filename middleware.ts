import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Le lingue che supportiamo
  locales: ['it', 'en'],
  // La lingua di base se non capiamo da dove viene l'utente
  defaultLocale: 'it'
});

export const config = {
  // Il vigile urbano si attiva su tutte le pagine, tranne i file di sistema e le immagini
  matcher: ['/((?!api|_next|.*\\..*).*)']
};