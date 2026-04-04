'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    const verifyEmail = async () => {
      if (code) {
        // Usiamo il client di Supabase che sappiamo già che hai!
        const supabase = createClient()
        
        // Scambiamo il codice con la sessione utente vera e propria
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

  // Schermata visibile all'utente mentre Supabase fa i calcoli
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-500">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-bold text-lg animate-pulse tracking-wider">Verifica email in corso...</p>
    </div>
  )
}