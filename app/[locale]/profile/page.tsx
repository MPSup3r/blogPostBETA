'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, User as UserIcon, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ username: string; role: string; avatar_url: string | null }>({ username: '', role: 'user', avatar_url: null })
  
  // Aggiunto stato per gestire il nuovo username
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const t = useTranslations('Profile')
  const tSettings = useTranslations('Settings') // Usiamo la traduzione del tasto indietro dalle impostazioni

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setNewUsername(data.username) // Impostiamo l'input con il nome attuale
      }
      setLoading(false)
    }
    getProfile()
  }, [router, supabase])

  // Funzione per aggiornare il Nickname
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || newUsername.trim() === profile.username) return

    setSavingUsername(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername.trim() })
      .eq('id', user.id)

    if (error) {
      setMessage({ type: 'error', text: t('error') })
    } else {
      setProfile({ ...profile, username: newUsername.trim() })
      setMessage({ type: 'success', text: t('successUsername') })
    }
    setSavingUsername(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setMessage({ type: 'info', text: t('compressing') })

    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 400, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)
      
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop()
        if (oldFileName) {
          await supabase.storage.from('avatars').remove([oldFileName])
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, compressedFile, { upsert: true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      if (updateError) throw updateError

      setProfile({ ...profile, avatar_url: publicUrl })
      setMessage({ type: 'success', text: t('successAvatar') })

    } catch (error) {
      setMessage({ type: 'error', text: t('error') })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-500 transition-colors duration-300">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-xl mx-auto pt-10">
        
        {/* Tasto indietro -> ora porta alle impostazioni! */}
        <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {tSettings('back')}
        </Link>

        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-2xl transition-colors duration-300">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center transition-colors">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-center transition-colors">{t('subtitle')}</p>

          <div className="flex flex-col items-center gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
                {profile.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */ 
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-slate-400 dark:text-slate-600 transition-colors" />
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            {profile.role === 'admin' && (
              <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/30 uppercase tracking-wider font-semibold transition-colors">
                {t('admin')}
              </span>
            )}
          </div>

          {/* NUOVO FORM PER MODIFICARE IL NICKNAME */}
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t('usernameLabel')}</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-grow bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="Il tuo username"
                  required
                />
                <button 
                  type="submit" 
                  disabled={savingUsername || newUsername.trim() === profile.username}
                  className="bg-slate-800 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20 text-white px-5 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {t('save')}
                </button>
              </div>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
              message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
              message.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
              'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}