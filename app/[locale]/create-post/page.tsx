'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Image as ImageIcon, Youtube, Bold, Heading, Send, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import imageCompression from 'browser-image-compression'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('CreatePost')

  // Controllo permessi (solo Admin può creare post)
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/'); return }
    }
    checkAdmin()
  }, [router, supabase])

  // --- CARICAMENTO COPERTINA ---
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non autorizzato")

      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)

      const fileExt = file.name.split('.').pop()
      const fileName = `cover-${user.id}-${Math.random()}.${fileExt}`

      // Usiamo il bucket "avatars" già esistente per comodità e permessi già settati
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, compressedFile)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setCoverUrl(publicUrl)
      
    } catch (error) {
      console.error(error)
      alert("Errore caricamento immagine")
    } finally {
      setIsUploading(false)
    }
  }

  // --- FUNZIONI BARRA DEGLI STRUMENTI (MARKDOWN) ---
  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const before = content.substring(0, start)
    const after = content.substring(end)

    setContent(before + prefix + selectedText + suffix + after)
    
    // Rimette il cursore al posto giusto dopo il click
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Inseriamo anche la cover_image nel database!
    const { error } = await supabase.from('posts').insert([
      { title, content, author_id: user.id, cover_image: coverUrl }
    ])

    if (error) {
      setMessage({ type: 'error', text: t('error') })
      setIsSubmitting(false)
    } else {
      setMessage({ type: 'success', text: t('success') })
      setTimeout(() => router.push('/'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t('back')}
        </Link>

        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-xl transition-colors duration-300">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{t('subtitle')}</p>

          <form onSubmit={handlePublish} className="space-y-6">
            
            {/* TITOLO POST */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t('postTitle')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg py-3 px-4 font-bold text-lg focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                placeholder="Scrivi un titolo accattivante..."
                required
              />
            </div>

            {/* COPERTINA POST */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t('cover')}</label>
              
              {coverUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video w-full max-h-64 bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCoverUrl(null)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm transition-colors">
                    Rimuovi
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
                  ) : (
                    <>
                      <div className="p-3 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{t('uploadCover')}</span>
                    </>
                  )}
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
            </div>

            {/* CONTENUTO POST CON BARRA DEGLI STRUMENTI */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t('content')}</label>
              
              <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/50 transition-colors">
                
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center gap-2 p-2 border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                  <button type="button" onClick={() => insertText('**', '**')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title={t('bold')}>
                    <Bold className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => insertText('\n### ', '')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title={t('heading')}>
                    <Heading className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                  <button type="button" onClick={() => insertText('\n![Descrizione immagine](', ')')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title={t('image')}>
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => insertText('\n[youtube](', ')')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title={t('youtube')}>
                    <Youtube className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* AREA DI TESTO */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-slate-900 dark:text-slate-200 p-4 min-h-[300px] focus:ring-1 focus:ring-cyan-500 outline-none resize-y transition-colors"
                  placeholder="Inizia a scrivere il tuo post qui... Usa i bottoni in alto per formattare!"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">I link ai video YouTube diventeranno automaticamente dei video riproducibili quando pubblichi il post!</p>
            </div>

            {/* MESSAGGI */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 text-sm transition-colors ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </div>
            )}

            {/* PULSANTE PUBBLICA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? t('loading') : t('publish')}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}