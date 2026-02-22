'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart } from 'lucide-react'

type LikeButtonProps = {
  postId: string
  initialLikes: number
  isLikedInitially: boolean
  userId?: string
}

export default function LikeButton({ postId, initialLikes, isLikedInitially, userId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(isLikedInitially)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const toggleLike = async () => {
    if (!userId) {
      alert("Devi accedere o registrarti per mettere Like!")
      return
    }
    
    // Evitiamo che l'utente clicchi mille volte al secondo
    if (loading) return
    setLoading(true)

    // TRUCCO "OPTIMISTIC UI": Cambiamo colore subito, senza aspettare il database. Rende il sito velocissimo!
    if (isLiked) {
      setLikes(prev => prev - 1)
      setIsLiked(false)
      // Rimuovi dal database
      await supabase.from('likes').delete().match({ post_id: postId, user_id: userId })
    } else {
      setLikes(prev => prev + 1)
      setIsLiked(true)
      // Aggiungi al database
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
    }

    setLoading(false)
  }

  return (
    <button 
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-rose-500 dark:text-rose-500' : 'text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400'}`}
    >
      <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} /> 
      <span className="text-sm font-medium">{likes} Like</span>
    </button>
  )
}