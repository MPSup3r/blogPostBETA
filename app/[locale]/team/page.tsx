'use client'

import Link from 'next/link'
import { ArrowLeft, User, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TeamPage() {
  const t = useTranslations('Team')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto pt-10 pb-16">
        
        {/* TASTO INDIETRO VERSO LE IMPOSTAZIONI */}
        <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </Link>

        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 md:p-10 rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-300">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">{t('subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* MEMBRO 1 */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-6 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-cyan-500/50 group">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Il tuo Nome</h3>
              <p className="text-sm font-medium text-cyan-600 dark:text-cyan-500 mb-6">{t('dev')}</p>
              <a href="mailto:latuamail@email.com" className="mt-auto flex items-center justify-center gap-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-lg transition-colors w-full font-semibold shadow-sm">
                <Mail className="w-4 h-4" /> {t('emailUs')}
              </a>
            </div>

            {/* MEMBRO 2 */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-6 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-cyan-500/50 group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Nome Compagno 1</h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-500 mb-6">{t('role1')}</p>
              <a href="mailto:compagno1@email.com" className="mt-auto flex items-center justify-center gap-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-lg transition-colors w-full font-semibold shadow-sm">
                <Mail className="w-4 h-4" /> {t('emailUs')}
              </a>
            </div>

            {/* MEMBRO 3 */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-6 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-cyan-500/50 group">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Nome Compagno 2</h3>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 mb-6">{t('role2')}</p>
              <a href="mailto:compagno2@email.com" className="mt-auto flex items-center justify-center gap-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-lg transition-colors w-full font-semibold shadow-sm">
                <Mail className="w-4 h-4" /> {t('emailUs')}
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}