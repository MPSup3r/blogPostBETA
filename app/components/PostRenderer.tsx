'use client'

import React from 'react'

export function PostRenderer({ content }: { content: string | null | undefined }) {
  
  const parseContent = (text: string | null | undefined) => {
    // Rete di sicurezza: se il contenuto è vuoto o indefinito, restituiamo stringa vuota
    if (!text) return '';

    return text
      // 1. Sicurezza: blocchiamo codice HTML maligno inserito a mano
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      
      // 2. VIDEO YOUTUBE: [youtube](https://www.youtube.com/watch?v=XYZ)
      .replace(/\[youtube\]\((.*?)\)/g, (match, url) => {
         const matchId = url.match(/(?:youtu\.be\/|v=)([^&\n]{11})/);
         const videoId = matchId ? matchId[1] : '';
         return videoId 
          ? `<div class="aspect-video my-6 w-full"><iframe class="w-full h-full rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div>` 
          : `<a href="${url}" target="_blank" class="text-cyan-500 underline">${url}</a>`;
      })
      
      // 3. IMMAGINI EXTRA: ![descrizione](url)
      .replace(/!\[(.*?)\]\((.*?)\)/g, `<img src="$2" alt="$1" class="rounded-xl w-full max-h-[500px] object-cover my-6 shadow-md border border-slate-200 dark:border-slate-700" />`)
      
      // 4. TITOLI: ### Titolo
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">$1</h3>')
      
      // 5. GRASSETTO: **testo**
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyan-700 dark:text-cyan-400">$1</strong>')
      
      // 6. ANDARE A CAPO (da fare per ultimo)
      .replace(/\n/g, '<br />');
  }

  return (
    <div 
      className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed transition-colors break-words"
      dangerouslySetInnerHTML={{ __html: parseContent(content) }} 
    />
  )
}