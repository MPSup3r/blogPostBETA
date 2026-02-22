'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true)
  }, [])

  if (!isClient) return <div className="w-9 h-9" />

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/20 transition-all duration-300"
      aria-label="Cambia tema"
    >
      {currentTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}