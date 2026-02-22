import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css' 
import { ThemeProvider } from '@/app/components/ThemeProvider'
import { NextIntlClientProvider } from 'next-intl'
// IMPORTIAMO getTranslations PER IL LATO SERVER
import { getMessages, getTranslations } from 'next-intl/server'
import { CookieBanner } from '@/app/components/CookieBanner'
import { Footer } from '@/app/components/Footer'
import { createClient } from '@supabase/supabase-js'

// MAGIA: Disabilita la cache! Così il sito si bloccherà all'ISTANTE appena cambi il DB.
export const revalidate = 0; 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoStocker Blog',
  description: 'Il blog di sviluppo di AutoStocker',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const messages = await getMessages();
  
  // Prepariamo le traduzioni per la Manutenzione
  const t = await getTranslations({ locale, namespace: 'Maintenance' });

  // CONTROLLO MANUTENZIONE IN TEMPO REALE
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: settings } = await supabase.from('app_settings').select('is_maintenance').eq('id', 1).single();
    
    if (settings?.is_maintenance) {
      return (
        <html lang={locale}>
          <body className={`${inter.className} min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center`}>
            <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in duration-500">
              <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-500 mb-6 tracking-tight">AutoStocker</h1>
              <div className="w-16 h-1 bg-cyan-500/30 mx-auto rounded-full mb-8"></div>
              {/* TESTI TRADOTTI LATO SERVER! */}
              <h2 className="text-2xl font-bold text-white mb-4">{t('title')}</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t('description')}
              </p>
            </div>
          </body>
        </html>
      )
    }
  }

  // SE IL SITO NON E' IN MANUTENZIONE, CARICA IL BLOG NORMALE:
  return (
    <html lang={locale} suppressHydrationWarning> 
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <CookieBanner />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}