'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale() // Legge se siamo su "it" o "en"
  const router = useRouter()
  const pathname = usePathname() // Legge l'indirizzo attuale (es: /it/profile)

  const toggleLanguage = () => {
    // Se è italiano passa a inglese, e viceversa
    const nextLocale = locale === 'it' ? 'en' : 'it'
    
    // Rimpiazza la lingua nell'URL senza farti perdere la pagina in cui ti trovi!
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 p-2 px-3 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition-all duration-300 font-bold text-xs uppercase tracking-wider"
      aria-label="Cambia lingua"
    >
      <Globe className="w-4 h-4" /> {locale}
    </button>
  )
}