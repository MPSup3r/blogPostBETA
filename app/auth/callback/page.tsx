'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

// 1. Separiamo la logica in un sotto-componente
function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    const verifyEmail = async () => {
      if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
          router.push('/') // Magia fatta, dritto alla home!
        } else {
          router.push('/login?error=VerificaFallita')
        }
      } else {
        router.push('/')
      }
    }

    verifyEmail()
  }, [code, router])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-500">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-bold text-lg animate-pulse tracking-wider">Verifica email in corso...</p>
    </div>
  )
}

// 2. Esportiamo la pagina principale avvolta in Suspense (per fare felice Vercel)
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold text-lg animate-pulse tracking-wider">Caricamento...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}