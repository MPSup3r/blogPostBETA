'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle, ShieldCheck, Info, User as UserIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [acceptTos, setAcceptTos] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [nickname, setNickname] = useState('')

  // STATO PER IL POPUP LEGALE
  const [modalContent, setModalContent] = useState<'tos' | 'privacy' | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('Auth')

  // L'useEffect è stato ELIMINATO per risolvere l'errore! 
  // La magia ora avviene direttamente nell'onChange dell'email (riga 131)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) setError(error.message)
    else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (step === 2 && (!acceptTos || !acceptPrivacy)) {
      setError(t('errorLegal'))
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => { setError(null); setStep(step - 1) }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: { username: nickname } 
      },
    })

    if (error) setError(error.message)
    else {
      setMessage(t('checkEmail'))
      setTimeout(() => { setIsLogin(true); setStep(1); setMessage(null) }, 4000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      <div className="w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-300 relative z-10">
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200 mb-6 text-center">
          {isLogin ? t('loginTitle') : t('registerTitle')} <span className="text-cyan-600 dark:text-cyan-500">AutoStocker</span>
        </h1>

        {!isLogin && (
          <div className="flex justify-between items-center mb-8 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>1</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>2</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 3 ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>3</div>
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleSignIn} className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg mt-4 disabled:opacity-50">
              {loading ? t('loading') : t('signIn')}
            </button>
          </form>
        ) : (
          <form onSubmit={step === 3 ? handleSignUp : nextStep} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => {
                        setEmail(e.target.value)
                        // ECCO LA SOLUZIONE: Generiamo il nickname qui in tempo reale!
                        setNickname(e.target.value.split('@')[0])
                      }} 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2 pl-10 pr-4 focus:ring-1 outline-none transition-colors" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2 pl-10 pr-4 focus:ring-1 outline-none transition-colors" minLength={6} required />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 flex gap-3">
                  <ShieldCheck className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t('legalWarning')}</p>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 group">
                    <input type="checkbox" id="tos" checked={acceptTos} onChange={(e) => setAcceptTos(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 cursor-pointer" />
                    <label htmlFor="tos" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex-grow">{t('tos')}</label>
                    <button type="button" onClick={() => setModalContent('tos')} className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded">
                      {t('read')}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <input type="checkbox" id="privacy" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 cursor-pointer" />
                    <label htmlFor="privacy" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex-grow">{t('privacy')}</label>
                    <button type="button" onClick={() => setModalContent('privacy')} className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded">
                      {t('read')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t('nicknameLabel')}</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2 pl-10 pr-4 font-bold focus:ring-1 outline-none transition-colors" required />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{t('avatarInfo')}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-colors">
                  {t('back')}
                </button>
              )}
              {step < 3 ? (
                <button type="submit" className="flex-grow bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-500/30">
                  {t('next')}
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-grow bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50">
                  {loading ? t('loading') : t('signUp')}
                </button>
              )}
            </div>
          </form>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 p-3 rounded-lg text-sm transition-colors">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> <p>{error}</p>
          </div>
        )}
        {message && (
          <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 p-3 rounded-lg text-sm transition-colors">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> <p>{message}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center transition-colors">
          <button onClick={() => { setIsLogin(!isLogin); setStep(1); setError(null) }} className="text-sm font-semibold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            {isLogin ? t('toRegister') : t('toLogin')}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            ← Torna alla Home
          </Link>
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
              {modalContent === 'tos' ? 'Termini di Servizio' : 'Privacy Policy'}
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 max-h-60 overflow-y-auto pr-2">
              {modalContent === 'tos' ? t('tosContent') : t('privacyContent')}
            </div>
            <button 
              onClick={() => setModalContent(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}