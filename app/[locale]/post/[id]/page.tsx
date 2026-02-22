'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User as UserIcon, Clock, Loader2, Send, CornerDownRight, ChevronDown, ChevronUp, Trash2, MessageSquare, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import LikeButton from '@/app/components/LikeButton'
import CommentLikeButton from '@/app/components/CommentLikeButton'
import { PostRenderer } from '@/app/components/PostRenderer'
import { useTranslations } from 'next-intl'

type Post = {
  id: string
  title: string
  content: string
  created_at: string
  cover_image: string | null
  profiles: { username: string; role: string; avatar_url: string | null }
  likes: { user_id: string }[]
}

type Comment = {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_id: string | null
  profiles: { username: string; role: string; avatar_url: string | null }
  comment_likes: { user_id: string }[]
}

export default function SinglePostPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = use(params)
  const postId = resolvedParams.id

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ username: string; role: string; avatar_url: string | null } | null>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null)
  const [expandedComments, setExpandedComments] = useState<string[]>([])

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('SinglePost')

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(profileData)
      }

      const { data: postData } = await supabase
        .from('posts')
        .select(`id, title, content, created_at, cover_image, profiles!posts_author_id_fkey(username, role, avatar_url), likes(user_id)`)
        .eq('id', postId)
        .single()

      if (postData) {
        setPost(postData as unknown as Post)
      } else {
        router.push('/')
        return
      }

      const { data: commentsData } = await supabase
        .from('comments')
        .select(`id, content, created_at, user_id, parent_id, profiles!comments_user_id_fkey(username, role, avatar_url), comment_likes(user_id)`)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (commentsData) setComments(commentsData as unknown as Comment[])
      setLoading(false)
    }

    fetchData()
  }, [postId, router, supabase])

  // ================= FUNZIONE PER ELIMINARE IL POST INTERO =================
  const handleDeletePost = async () => {
    if (!window.confirm(t('confirmDelete'))) return

    setIsSubmitting(true)
    const { error } = await supabase.from('posts').delete().eq('id', postId)

    if (!error) {
      router.push('/') // Torna alla home dopo l'eliminazione
    } else {
      alert("Errore durante l'eliminazione del post.")
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert([{ 
        post_id: postId, 
        user_id: user.id, 
        content: newComment, 
        parent_id: replyingTo ? replyingTo.id : null 
      }])

    if (!error) {
      setNewComment('')
      setReplyingTo(null)
      refreshComments()
      if (replyingTo && !expandedComments.includes(replyingTo.id)) {
        setExpandedComments(prev => [...prev, replyingTo.id])
      }
    }
    setIsSubmitting(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Vuoi davvero eliminare questo commento e tutte le sue risposte?")) return
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(comments.filter(c => c.id !== commentId && c.parent_id !== commentId))
  }

  const refreshComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`id, content, created_at, user_id, parent_id, profiles!comments_user_id_fkey(username, role, avatar_url), comment_likes(user_id)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    if (data) setComments(data as unknown as Comment[])
  }

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const topLevelComments = comments.filter(c => !c.parent_id)

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-500 transition-colors duration-300">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-bold text-lg animate-pulse tracking-wider">{t('loading')}</p>
    </div>
  )

  if (!post) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300 pb-20">
      
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> {t('back')}
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        
        {post.cover_image && (
          <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden bg-slate-200 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-4 md:px-8 max-w-3xl mx-auto mt-10">
          
          {/* SEZIONE HEADER (Titolo, Autore + TASTO ELIMINA POST) */}
          <header className="mb-10 text-center relative">
            
            {/* IL TASTO MAGICO PER L'ADMIN */}
            <div className="flex justify-end mb-4">
              {profile?.role === 'admin' && (
                <button 
                  onClick={handleDeletePost}
                  disabled={isSubmitting}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {t('deletePost')}
                </button>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 dark:text-slate-400 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-4 py-2 rounded-full transition-colors">
                {post.profiles?.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={post.profiles.avatar_url} alt="Author" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                <span className="text-cyan-700 dark:text-cyan-400 font-bold tracking-wide">
                  {post.profiles?.username || 'Team'}
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {formatDate(post.created_at)}
              </span>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none break-words overflow-hidden">
            <PostRenderer content={post.content} />
          </div>

          <div className="mt-12 py-6 border-t border-b border-slate-200 dark:border-slate-800 flex justify-center">
            <LikeButton 
              postId={post.id}
              initialLikes={post.likes ? post.likes.length : 0}
              isLikedInitially={post.likes ? post.likes.some(like => like.user_id === user?.id) : false}
              userId={user?.id}
            />
          </div>

          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">{t('discussion')} ({comments.length})</h3>

            <div className="space-y-6 mb-10">
              {topLevelComments.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8 italic">{t('noComments')}</p>
              ) : (
                topLevelComments.map((comment) => {
                  const replies = comments.filter(c => c.parent_id === comment.id)
                  const isExpanded = expandedComments.includes(comment.id)

                  return (
                    <div key={comment.id} className="flex flex-col gap-3">
                      
                      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 p-4 sm:p-5 rounded-xl flex gap-4 shadow-sm group">
                        <div className="flex-shrink-0">
                          {comment.profiles?.avatar_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={comment.profiles.avatar_url} alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                              <UserIcon className="w-5 h-5 text-slate-500" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-cyan-700 dark:text-cyan-400">{comment.profiles?.username || 'Utente'}</span>
                              {comment.profiles?.role === 'admin' && (
                                <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[10px] px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30 uppercase tracking-wider">Admin</span>
                              )}
                              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">{formatDate(comment.created_at)}</span>
                            </div>
                            {(user?.id === comment.user_id || profile?.role === 'admin') && (
                              <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-wrap">{comment.content}</p>
                          
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200 dark:border-white/5">
                            <CommentLikeButton 
                              commentId={comment.id} 
                              initialLikes={comment.comment_likes ? comment.comment_likes.length : 0} 
                              isLikedInitially={comment.comment_likes ? comment.comment_likes.some(like => like.user_id === user?.id) : false} 
                              userId={user?.id} 
                            />
                            {user && (
                              <button 
                                onClick={() => setReplyingTo({ id: comment.id, username: comment.profiles?.username || 'Utente' })}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4" /> {t('reply')}
                              </button>
                            )}
                          </div>

                          {replies.length > 0 && (
                            <div className="mt-3">
                              <button 
                                onClick={() => toggleReplies(comment.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
                              >
                                <div className="w-6 border-b border-cyan-200 dark:border-cyan-500/30"></div>
                                {isExpanded ? (
                                  <>{t('hideReplies')} <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>{t('viewReplies')} ({replies.length}) <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {replies.length > 0 && isExpanded && (
                        <div className="pl-12 space-y-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {replies.map(reply => (
                            <div key={reply.id} className="bg-white dark:bg-white/5 p-4 rounded-xl flex gap-3 group border-l-2 border-cyan-300 dark:border-cyan-600/30 shadow-sm">
                              <div className="flex-shrink-0">
                                {reply.profiles?.avatar_url ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={reply.profiles.avatar_url} alt="User" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                                    <UserIcon className="w-4 h-4 text-slate-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-cyan-700 dark:text-cyan-400 text-sm">{reply.profiles?.username || 'Utente'}</span>
                                    {reply.profiles?.role === 'admin' && (
                                      <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[9px] px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30 uppercase tracking-wider">Admin</span>
                                    )}
                                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">{formatDate(reply.created_at)}</span>
                                  </div>
                                  {(user?.id === reply.user_id || profile?.role === 'admin') && (
                                    <button onClick={() => handleDeleteComment(reply.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 whitespace-pre-wrap">{reply.content}</p>
                                
                                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5">
                                  <CommentLikeButton 
                                    commentId={reply.id} 
                                    initialLikes={reply.comment_likes ? reply.comment_likes.length : 0} 
                                    isLikedInitially={reply.comment_likes ? reply.comment_likes.some(like => like.user_id === user?.id) : false} 
                                    userId={user?.id} 
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {user ? (
              <div className="pt-6 border-t border-slate-200 dark:border-white/5 relative">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-sm p-3 rounded-t-lg border-b border-cyan-200 dark:border-cyan-800/50 mb-[-5px]">
                    <span>Stai rispondendo a <strong>@{replyingTo.username}</strong></span>
                    <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-cyan-900 dark:hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                )}
                
                <form onSubmit={handleAddComment} className="flex gap-3 items-start relative z-10">
                   <div className="flex-shrink-0 mt-1">
                      {profile?.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={profile.avatar_url} alt="Me" className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                          <UserIcon className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                   </div>
                   <div className="flex-grow flex gap-3">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? `${t('reply')}...` : t('writeComment')}
                        className={`flex-grow bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-200 py-3 px-4 focus:outline-none focus:ring-1 transition-colors ${replyingTo ? 'rounded-b-lg rounded-tr-lg border-cyan-200 dark:border-cyan-800/50 focus:border-cyan-500 focus:ring-cyan-500' : 'rounded-lg border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'}`}
                        required
                      />
                      <button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center h-[50px]">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                   </div>
                </form>
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-xl text-center mt-8">
                <p className="text-slate-600 dark:text-slate-400 mb-3">{t('loginToComment')}</p>
                <Link href="/login" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold underline transition-colors">
                  Vai al Login
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}