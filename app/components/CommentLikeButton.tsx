'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Heart } from 'lucide-react'

type CommentLikeButtonProps = {
  commentId: string
  initialLikes: number
  isLikedInitially: boolean
  userId?: string
}

export default function CommentLikeButton({ commentId, initialLikes, isLikedInitially, userId }: CommentLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(isLikedInitially)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const toggleLike = async () => {
    if (!userId) {
      alert("Devi accedere o registrarti per mettere Like!")
      return
    }
    
    if (loading) return
    setLoading(true)

    if (isLiked) {
      setLikes(prev => prev - 1)
      setIsLiked(false)
      await supabase.from('comment_likes').delete().match({ comment_id: commentId, user_id: userId })
    } else {
      setLikes(prev => prev + 1)
      setIsLiked(true)
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId })
    }

    setLoading(false)
  }

  return (
    <button 
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500 dark:text-rose-500' : 'text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400'}`}
    >
      <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} /> 
      <span className="text-xs font-medium">{likes > 0 ? likes : 'Mi piace'}</span>
    </button>
  )
}