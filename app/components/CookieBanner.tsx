'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie, X } from 'lucide-react'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('Cookies')

  // Controlla se l'utente ha già fatto una scelta salvata nel computer
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // eslint-disable-next-line
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 animate-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-6 transition-colors">
        
        <div className="flex-grow flex items-start sm:items-center gap-4">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full flex-shrink-0">
            <Cookie className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('message')}
          </p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3 flex-shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            {t('decline')}
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/30"
          >
            {t('accept')}
          </button>
        </div>

      </div>
    </div>
  )
}