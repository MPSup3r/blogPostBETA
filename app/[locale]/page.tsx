'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import './style.css'

const ModelViewer = (props: React.HTMLAttributes<HTMLElement> & {
  src?: string;
  'auto-rotate'?: boolean | string;
  'camera-controls'?: boolean | string;
  'disable-zoom'?: boolean | string;
  'shadow-intensity'?: string | number;
  'camera-orbit'?: string;
  'min-camera-orbit'?: string;
}) => {
  return React.createElement('model-viewer', props);
};

export default function HomeVetrina() {
  const t = useTranslations('Landing') 

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDarkMode(true);
      document.body.classList.add('dark-mode'); 
      document.documentElement.setAttribute('data-theme', 'dark'); 
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const modelViewerScript = document.createElement('script')
    modelViewerScript.type = 'module'
    modelViewerScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js'
    document.head.appendChild(modelViewerScript)

    const myScript = document.createElement('script')
    myScript.src = '/script.js'
    myScript.async = true
    document.body.appendChild(myScript)

    const animatedElements = document.querySelectorAll('.animate-block, .stagger-box > *, .flip-card');
    
    animatedElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      const animType = el.getAttribute('data-animation');
      if (animType === 'slideRight') htmlEl.style.transform = 'translateX(-50px)';
      else if (animType === 'slideLeft') htmlEl.style.transform = 'translateX(50px)';
      else htmlEl.style.transform = 'translateY(50px)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0) translateX(0) scale(1)';
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach((el) => observer.observe(el));

    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
      if (navbar) {
        navbar.style.transition = 'top 0.3s ease-in-out';
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          navbar.style.top = '-100px'; 
        } else {
          navbar.style.top = '0';
        }
        lastScrollY = window.scrollY;
      }

      let currentSectionId = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          currentSectionId = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach((link) => {
        const htmlLink = link as HTMLElement;
        const href = htmlLink.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          htmlLink.style.color = ''; 
          htmlLink.style.textShadow = '';
          htmlLink.style.fontWeight = 'normal';
          
          if (href === `#${currentSectionId}`) {
            htmlLink.style.color = '#00d2ff';
            htmlLink.style.textShadow = '0 0 10px rgba(0,210,255,0.3)';
            htmlLink.style.fontWeight = 'bold';
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (document.head.contains(modelViewerScript)) document.head.removeChild(modelViewerScript)
      if (document.body.contains(myScript)) document.body.removeChild(myScript)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="vetrina-wrapper">
      
      <nav id="navbar">
        <div className="nav-content">
          <a href="#" className="logo">
            <img src="/logo_full_black.png" alt="AUTOSTOKER" className="logo-img" />
          </a>
          <ul className="nav-links">
            <li><a href="#visione">Visione</a></li>
            <li><a href="#architettura">Architettura</a></li>
            <li><a href="#locomozione">Locomozione</a></li>
            <li><a href="#sostenibilita">Sostenibilità</a></li>
            <li><a href="#software">Software</a></li>
            <li><a href="#team">Team</a></li>
            <li><Link href="/modello">Modello 3D</Link></li>
            <li><Link href="/galleria">Galleria</Link></li>
            
            <li>
              <Link href="/blog" style={{ fontWeight: 'bold', color: '#00d2ff', textShadow: '0 0 10px rgba(0,210,255,0.5)' }}>
                Vai al Blog
              </Link>
            </li>
          </ul>

          <label className="theme-switch" aria-label="Cambia Tema">
            <input 
              type="checkbox" 
              id="theme-checkbox" 
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider round">
              <span className="icon sun">☀️</span>
              <span className="icon moon">🌙</span>
            </span>
          </label>
        </div>
      </nav>

      <header className="hero">
        <ModelViewer
          src="/MechaVersion0_1.glb"
          auto-rotate="true"
          camera-controls="true"
          disable-zoom="true"
          shadow-intensity="1"
          className="hero-3d-model"
          camera-orbit="0deg 75deg 180%" 
          min-camera-orbit="auto auto 150%"
          style={{ paddingTop: '80px' }}
        />

        <div className="hero-text glass-panel animate-block" data-animation="fadeUp">
          <h1><span className="gradient-text">AUTOSTOKER</span></h1>
          <p className="subtitle">Il prototipo di robot mobile intelligente per l&apos;automazione industriale sostenibile.</p>
          <p className="school">Un progetto del team dell&apos;IIS Torricelli di Milano.</p>
        </div>

        <Link href="/modello" className="minimal-3d-link animate-block" data-animation="fadeUp">
          Esplora il modello 3D completo <span>→</span>
        </Link>
      </header>

      <section id="visione" className="section text-center animate-block" data-animation="fadeUp">
        <div className="container">
          <h2 className="gradient-text">Visione del Progetto</h2>
          <p className="lead">AUTOSTOKER è stato concepito come soluzione sperimentale per ambienti produttivi e logistici, capace di supportare attività operative quali movimentazione oggetti, assistenza ai processi e monitoraggio ambientale.</p>
          <p>L&apos;intero sistema nasce con l&apos;obiettivo di dimostrare concretamente come robotica, efficienza energetica e integrazione software-hardware possano convergere in una piattaforma tecnologica modulare e scalabile, seguendo un approccio ingegneristico multidisciplinare.</p>
        </div>
      </section>

      <section id="architettura" className="section bg-alt">
        <div className="container grid-2">
          <div className="text-content animate-block" data-animation="slideRight">
            <h2 className="gradient-text">Architettura Meccanica e Strutturale</h2>
            <p>Dal punto di vista strutturale, il robot adotta un&apos;architettura innovativa basata su due arti mobili indipendenti (gambe). Questa soluzione è stata scelta per ottimizzare la distribuzione delle masse e la stabilità dinamica.</p>
            <ul className="stagger-box">
              <li><strong>Il Corpo Centrale:</strong> Costituisce il busto strutturale portante, rigidamente integrato con il telaio principale. Al suo interno sono alloggiati i moduli elettronici, sensoriali ed energetici, configurati per garantire la massima protezione dei componenti e un bilanciamento dei pesi ottimale.</li>
              <li><strong>Sistema di Manipolazione:</strong> Per le operazioni di presa, AUTOSTOKER utilizza un meccanismo costituito da due bracci lineari contrapposti. Questa soluzione garantisce una forza uniforme sull&apos;oggetto, robustezza strutturale ed efficienza energetica superiore rispetto a sistemi articolati complessi.</li>
            </ul>
          </div>
          <div className="image-content animate-block" data-animation="slideLeft">
            <img src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800" alt="Struttura meccanica" />
          </div>
        </div>
      </section>

      <section id="locomozione" className="section text-center">
        <div className="container animate-block" data-animation="fadeUp">
          <h2 className="gradient-text">Sistema di Locomozione Avanzato</h2>
          <p className="lead">Il sistema di movimento è il cuore tecnologico del prototipo.</p>
          <p>Ogni &quot;piede&quot; del robot integra un set di due ruote con funzioni sdoppiate:</p>
          <div className="cards-grid stagger-box">
            <div className="flip-card locomotion-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>Ruota Anteriore (Sterzo)</h3>
                  <p className="team-role">Controllo Direzionale</p>
                </div>
                <div className="flip-card-back locomotion-back-content">
                  <p>Dedicata esclusivamente alla direzione. Essendo priva di trazione, permette una precisione millimetrica nelle manovre e riduce drasticamente gli attriti durante i cambi di traiettoria.</p>
                </div>
              </div>
            </div>
            <div className="flip-card locomotion-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>Ruota Posteriore (Trazione)</h3>
                  <p className="team-role">Forza Motrice</p>
                </div>
                <div className="flip-card-back locomotion-back-content">
                  <p>Dedicata esclusivamente alla spinta e alla forza motrice. Questa configurazione ibrida permette un controllo dinamico superiore, evitando slittamenti e ottimizzando il consumo energetico durante lo spostamento di carichi pesanti.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sostenibilita" className="section bg-alt">
        <div className="container grid-2 reverse">
          <div className="text-content animate-block" data-animation="slideLeft">
            <h2 className="gradient-text">Sostenibilità e Industria 5.0</h2>
            <p>Particolare attenzione è stata dedicata all&apos;impatto ambientale e all&apos;efficienza:</p>
            <ul className="stagger-box">
              <li><strong>Materiali:</strong> La struttura e i componenti meccanici sono progettati per la manifattura additiva (stampa 3D) utilizzando materiali plastici riciclati.</li>
              <li><strong>Gestione Energetica:</strong> Il sistema integra batterie ricaricabili supportate da moduli solari e un dispositivo di recupero dell&apos;energia cinetica (KERS) durante le fasi di decelerazione, riducendo gli sprechi energetici nel ciclo operativo.</li>
            </ul>
          </div>
          <div className="image-content animate-block" data-animation="slideRight">
            <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800" alt="Sostenibilità" />
          </div>
        </div>
      </section>

      <section id="software" className="section text-center">
        <div className="container animate-block" data-animation="fadeUp">
          <h2 className="gradient-text">Architettura Software e Controllo</h2>
          <p className="lead">L&apos;intelligenza del robot gestisce in modo coordinato locomozione e sensoristica attraverso tre modalità operative:</p>
          <div className="cards-grid three-cols stagger-box">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>1. Controllo Remoto</h3>
                  <p>Wireless</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400" alt="Controllo Remoto" />
                  <div className="back-content">
                    <p>Per manovre manuali d&apos;emergenza o precisione.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>2. Modalità Automatica</h3>
                  <p>Algoritmi Intelligenti</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400" alt="Navigazione Autonoma" />
                  <div className="back-content">
                    <p>Basata su algoritmi intelligenti per la navigazione autonoma.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>3. Piattaforma Web</h3>
                  <p>Monitoraggio Gestionale</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" alt="Piattaforma Web" />
                  <div className="back-content">
                    <p>Per il monitoraggio costante, la configurazione dei parametri e la sicurezza operativa contro comandi non autorizzati.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section bg-alt text-center animate-block" data-animation="fadeUp">
        <div className="container">
          <h2 className="gradient-text">Ruoli del Team di Sviluppo</h2>
          <div className="team-grid stagger-box">
            <div className="flip-card team-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/AtienzaPFP.png" alt="Daniele Atienza" className="team-photo" />
                  <h3>Daniele Atienza</h3>
                  <p className="team-role">Progettazione hardware e struttura meccanica.</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">Appassionato di design 3D e robotica, si occupa di trasformare le idee in componenti fisici solidi, ottimizzando le masse per la piattaforma AUTOSTOKER.</p>
                  <div className="social-links">
                    <a href="https://github.com/atienzadaniele4-arch" target="_blank" rel="noreferrer" className="social-btn">GitHub</a>
                    <a href="https://www.linkedin.com/in/daniele-atienza-a555843b2/" target="_blank" rel="noreferrer" className="social-btn">LinkedIn</a>
                    <a href="mailto:atienzadaniele4@gmail.com" className="social-btn">Email</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card team-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/PratiPFP.png" alt="Manuel Prati" className="team-photo" />
                  <h3>Manuel Prati</h3>
                  <p className="team-role">Sviluppo software e sistemi di controllo.</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">Mente logica del gruppo, programma gli applicativi per il controllo del robot. Inoltre programma il gestionale e il sito web, curando il lato comunicativo del progetto.</p>
                  <div className="social-links">
                    <a href="https://github.com/MPSup3r" target="_blank" rel="noreferrer" className="social-btn">GitHub</a>
                    <a href="https://it.linkedin.com/in/manuel-prati-3585613b2" target="_blank" rel="noreferrer" className="social-btn">LinkedIn</a>
                    <a href="mailto:manuelprati08@gmail.com" className="social-btn">Email</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card team-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/EbraicoPFP.png" alt="Lorenzo Ebraico" className="team-photo" />
                  <h3>Lorenzo Ebraico</h3>
                  <p className="team-role">Programmazione hardware e integrazione elettronica.</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">Specialista dei circuiti, fa da ponte vitale tra la meccanica del robot e il codice, curando la complessa sensoristica e la gestione energetica.</p>
                  <div className="social-links">
                    <a href="https://github.com/CosmoUniverso" target="_blank" rel="noreferrer" className="social-btn">GitHub</a>
                    <a href="https://it.linkedin.com/in/lorenzo-ebraico-bb85933b2" target="_blank" rel="noreferrer" className="social-btn">LinkedIn</a>
                    <a href="mailto:lorenzo.ebraico@gmail.com" className="social-btn">Email</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}