'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User as UserIcon, Loader2, Settings, MessageCircle } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'
import LikeButton from '@/app/components/LikeButton' // <--- REINSERITO IL LIKE BUTTON

type Post = {
  id: string
  title: string
  content: string
  created_at: string
  cover_image: string | null
  profiles: { username: string; avatar_url: string | null }
  likes: { user_id: string }[] // <--- REINSERITI I LIKE NEL TIPO
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ username: string; role: string; avatar_url: string | null } | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const t = useTranslations('HomePage')
  const tNav = useTranslations('Nav')

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(profileData)
      }

      // <--- CHIEDIAMO ANCHE I LIKES AL DATABASE
      const { data: postsData } = await supabase
        .from('posts')
        .select(`id, title, content, created_at, cover_image, profiles!posts_author_id_fkey(username, avatar_url), likes(user_id)`)
        .order('created_at', { ascending: false })

      if (postsData) setPosts(postsData as unknown as Post[])
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options) 
  }

  const getExcerpt = (text: string) => {
    const noMarkdown = text
      .replace(/\[youtube\]\(.*?\)/g, '') 
      .replace(/!\[.*?\]\(.*?\)/g, '')    
      .replace(/###/g, '')                
      .replace(/\*\*/g, '')               
      .replace(/\n/g, ' ')                
      .trim();

    return noMarkdown.length > 200 ? noMarkdown.substring(0, 200) + '...' : noMarkdown;
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-500 transition-colors duration-300">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-bold text-lg animate-pulse tracking-wider">{t('loading')}</p>
    </div>
  )

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity text-slate-900 dark:text-white">
            AutoStocker <span className="text-cyan-600 dark:text-cyan-500">Blog</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/settings" className="flex items-center gap-2 text-sm bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group">
                  {profile?.avatar_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={profile.avatar_url} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200">{profile?.username || user.email}</span>
                  <Settings className="w-4 h-4 ml-1 text-slate-400 group-hover:text-cyan-500 transition-colors group-hover:rotate-90 duration-300" />
                </Link>

                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-400/10 hover:bg-red-100 dark:hover:bg-red-400/20 px-3 py-1.5 rounded-full">
                  <LogOut className="w-4 h-4" /> {tNav('logout')}
                </button>
              </div>
            ) : (
               <Link href="/login" className="bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/20">
                 {tNav('login')}
               </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 text-slate-900 dark:text-white transition-colors">{t('title')}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">{t('subtitle')}</p>
          </div>
          {profile?.role === 'admin' && (
            <Link href="/create-post" className="hidden sm:inline-block bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-500/20">
              {t('newPost')}
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
             <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-md dark:shadow-xl transition-colors">
               <p className="text-lg">{t('empty')}</p>
             </div>
          ) : (
            posts.map((post) => (
              
              <article key={post.id} className="flex flex-col md:flex-row gap-6 bg-transparent p-2 rounded-xl border border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300 group">
                
                {/* IMMAGINE CLICCABILE */}
                <Link href={`/post/${post.id}`} className="w-full md:w-72 lg:w-80 flex-shrink-0 aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-lg block">
                  {post.cover_image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-400 dark:text-slate-600 text-sm">Nessuna copertina</span>
                    </div>
                  )}
                </Link>

                {/* TESTO A DESTRA */}
                <div className="flex flex-col flex-grow py-1">
                  
                  {/* TITOLO E RIASSUNTO CLICCABILI */}
                  <Link href={`/post/${post.id}`} className="block mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-cyan-700 dark:text-cyan-500 mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors uppercase tracking-wide">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                      {getExcerpt(post.content)}
                    </p>
                  </Link>

                  {/* BARRA INFERIORE (Data, Autore, Like e Commenti) */}
                  <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800/50 gap-4">
                    
                    <div className="flex items-center gap-3">
                      <span className="border-b border-dashed border-slate-400 dark:border-slate-600 pb-0.5">
                        {formatDate(post.created_at)}
                      </span>
                      <span>
                        Posted by <span className="font-semibold text-slate-700 dark:text-slate-300">{post.profiles?.username || 'Team'}</span>
                      </span>
                    </div>

                    {/* BOTTONI INTERATTIVI */}
                    <div className="flex items-center gap-6">
                      <LikeButton 
                        postId={post.id}
                        initialLikes={post.likes ? post.likes.length : 0}
                        isLikedInitially={post.likes ? post.likes.some(like => like.user_id === user?.id) : false}
                        userId={user?.id}
                      />
                      <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <MessageCircle className="w-4 h-4" /> 
                        <span className="font-medium">{t('commentOrRead')}</span>
                      </Link>
                    </div>

                  </div>
                </div>

              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}