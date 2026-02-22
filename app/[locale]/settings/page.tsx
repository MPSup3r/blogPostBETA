'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Palette, Globe, ChevronRight, FileText, ShieldAlert, X, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const tAuth = useTranslations('Auth') 

  const [modalContent, setModalContent] = useState<'tos' | 'privacy' | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto pt-10 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </Link>

        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 md:p-10 rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-300">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{t('subtitle')}</p>

          <div className="space-y-4 mb-8">
            {/* TASTO PROFILO */}
            <Link href="/profile" className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('profile')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </Link>

            {/* TEMA */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('appearance')}</span>
              </div>
              <ThemeToggle />
            </div>

            {/* LINGUA */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('language')}</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* ================= SEZIONE LEGALE & TEAM ================= */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {t('legal')} & Info
          </h2>
          <div className="space-y-4 mb-8">
            
            <button onClick={() => setModalContent('tos')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('tos')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </button>

            <button onClick={() => setModalContent('privacy')} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('privacy')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            </button>

            {/* NUOVO TASTO CHE PORTA ALLA PAGINA TEAM */}
            <Link href="/team" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5 group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t('contacts')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </Link>

          </div>
        </div>
      </div>

      {/* POPUP (MODAL) PER LE SCARTOFFIE */}
      {modalContent && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {modalContent === 'tos' ? t('tos') : t('privacy')}
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 max-h-60 overflow-y-auto pr-2">
              {modalContent === 'tos' ? tAuth('tosContent') : tAuth('privacyContent')}
            </div>
            <button 
              onClick={() => setModalContent(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {tAuth('close')}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}