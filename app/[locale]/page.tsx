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
            <li><a href="#visione">{t('nav.vision')}</a></li>
            <li><a href="#architettura">{t('nav.architecture')}</a></li>
            <li><a href="#locomozione">{t('nav.locomotion')}</a></li>
            <li><a href="#sostenibilita">{t('nav.sustainability')}</a></li>
            <li><a href="#software">{t('nav.software')}</a></li>
            <li><a href="#team">{t('nav.team')}</a></li>
            <li><Link href="/modello">{t('nav.model3d')}</Link></li>
            <li><Link href="/galleria">{t('nav.gallery')}</Link></li>
            
            <li>
              <Link href="/post" style={{ fontWeight: 'bold', color: '#00d2ff', textShadow: '0 0 10px rgba(0,210,255,0.5)' }}>
                {t('nav.blog')}
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
          <p className="subtitle">{t('hero.subtitle')}</p>
          <p className="school">{t('hero.school')}</p>
        </div>

        <Link href="/modello" className="minimal-3d-link animate-block" data-animation="fadeUp">
          {t('hero.exploreBtn')} <span>→</span>
        </Link>
      </header>

      <section id="visione" className="section text-center animate-block" data-animation="fadeUp">
        <div className="container">
          <h2 className="gradient-text">{t('vision.title')}</h2>
          <p className="lead">{t('vision.p1')}</p>
          <p>{t('vision.p2')}</p>
        </div>
      </section>

      <section id="architettura" className="section bg-alt">
        <div className="container grid-2">
          <div className="text-content animate-block" data-animation="slideRight">
            <h2 className="gradient-text">{t('architecture.title')}</h2>
            <p>{t('architecture.desc')}</p>
            <ul className="stagger-box">
              <li><strong>{t('architecture.bodyTitle')}</strong> {t('architecture.bodyDesc')}</li>
              <li><strong>{t('architecture.manipulationTitle')}</strong> {t('architecture.manipulationDesc')}</li>
            </ul>
          </div>
          <div className="image-content animate-block" data-animation="slideLeft">
            <img src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800" alt="Struttura meccanica" />
          </div>
        </div>
      </section>

      <section id="locomozione" className="section text-center">
        <div className="container animate-block" data-animation="fadeUp">
          <h2 className="gradient-text">{t('locomotion.title')}</h2>
          <p className="lead">{t('locomotion.desc1')}</p>
          <p>{t('locomotion.desc2')}</p>
          <div className="cards-grid stagger-box">
            <div className="flip-card locomotion-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{t('locomotion.frontWheel')}</h3>
                  <p className="team-role">{t('locomotion.frontRole')}</p>
                </div>
                <div className="flip-card-back locomotion-back-content">
                  <p>{t('locomotion.frontDesc')}</p>
                </div>
              </div>
            </div>
            <div className="flip-card locomotion-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{t('locomotion.rearWheel')}</h3>
                  <p className="team-role">{t('locomotion.rearRole')}</p>
                </div>
                <div className="flip-card-back locomotion-back-content">
                  <p>{t('locomotion.rearDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sostenibilita" className="section bg-alt">
        <div className="container grid-2 reverse">
          <div className="text-content animate-block" data-animation="slideLeft">
            <h2 className="gradient-text">{t('sustainability.title')}</h2>
            <p>{t('sustainability.desc')}</p>
            <ul className="stagger-box">
              <li><strong>{t('sustainability.materialsTitle')}</strong> {t('sustainability.materialsDesc')}</li>
              <li><strong>{t('sustainability.energyTitle')}</strong> {t('sustainability.energyDesc')}</li>
            </ul>
          </div>
          <div className="image-content animate-block" data-animation="slideRight">
            <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800" alt="Sostenibilità" />
          </div>
        </div>
      </section>

      <section id="software" className="section text-center">
        <div className="container animate-block" data-animation="fadeUp">
          <h2 className="gradient-text">{t('software.title')}</h2>
          <p className="lead">{t('software.desc')}</p>
          <div className="cards-grid three-cols stagger-box">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{t('software.remoteTitle')}</h3>
                  <p>{t('software.remoteSubtitle')}</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400" alt="Controllo Remoto" />
                  <div className="back-content">
                    <p>{t('software.remoteDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{t('software.autoTitle')}</h3>
                  <p>{t('software.autoSubtitle')}</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400" alt="Navigazione Autonoma" />
                  <div className="back-content">
                    <p>{t('software.autoDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h3>{t('software.webTitle')}</h3>
                  <p>{t('software.webSubtitle')}</p>
                </div>
                <div className="flip-card-back">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" alt="Piattaforma Web" />
                  <div className="back-content">
                    <p>{t('software.webDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section bg-alt text-center animate-block" data-animation="fadeUp">
        <div className="container">
          <h2 className="gradient-text">{t('team.title')}</h2>
          <div className="team-grid stagger-box">
            <div className="flip-card team-flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/AtienzaPFP.png" alt="Daniele Atienza" className="team-photo" />
                  <h3>Daniele Atienza</h3>
                  <p className="team-role">{t('team.danieleRole')}</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">{t('team.danieleBio')}</p>
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
                  <p className="team-role">{t('team.manuelRole')}</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">{t('team.manuelBio')}</p>
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
                  <p className="team-role">{t('team.lorenzoRole')}</p>
                </div>
                <div className="flip-card-back team-back-content">
                  <p className="team-bio">{t('team.lorenzoBio')}</p>
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