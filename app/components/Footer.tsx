import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/50 py-8 mt-auto transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center text-sm text-slate-600 dark:text-slate-400 space-y-2">
        
        {/* INFO AZIENDALI / SCOLASTICHE */}
        <p>via U. Dini, 7 - 20142 - 201xx Milano (MI)</p>
        <p>
          Tel 02/89511344 - Mail:{' '}
          <a href="mailto:miis101008@istruzione.it" className="underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            miis101008@istruzione.it
          </a>{' '}
          - PEC:{' '}
          <a href="mailto:miis101008@pec.istruzione.it" className="underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            miis101008@pec.istruzione.it
          </a>
        </p>
        <p>Codice meccanografico: MIIS101008 - C.F. 97324880158</p>

        {/* LINEA SEPARATRICE */}
        <div className="w-full max-w-3xl border-t border-slate-300 dark:border-white/10 my-6"></div>

        {/* CREDITI */}
        <div className="flex flex-col md:flex-row justify-between w-full max-w-3xl items-center text-xs">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} AutoStocker Blog. Tutti i diritti riservati.</p>
          <div className="text-center md:text-right space-y-1">
            <p>Concept & Design by <strong>Designers Italia</strong></p>
            <p>Sito web realizzato con CMS SCUOLASTICO</p>
          </div>
        </div>

      </div>
    </footer>
  )
}