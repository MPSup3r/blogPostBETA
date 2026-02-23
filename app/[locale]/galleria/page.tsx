'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import '../style.css'

export default function GalleriaPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = [
    "/robot.png",
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  ];

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="vetrina-wrapper" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      
      <div style={{ padding: '60px 20px 20px 20px' }}>
        <div className="container text-center">
          <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '15px' }}>Galleria AUTOSTOKER</h2>
          <p className="lead">Esplora i dettagli, i render e le fasi di progettazione.</p>
          
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px', marginTop: '50px', marginBottom: '50px' 
          }}>
            {images.map((src, idx) => (
              <div key={idx} onClick={() => setLightboxIndex(idx)}
                style={{ 
                  borderRadius: '15px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', cursor: 'zoom-in', transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={src} alt={`Galleria ${idx + 1}`} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* TASTO "TORNA ALLA HOME" (A fondo pagina, centrato e libero) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Link 
              href="/" 
              className="minimal-3d-link" 
              style={{ position: 'relative', bottom: 'auto' }}
            >
              <span>←</span> Torna alla Home
            </Link>
          </div>

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          <span style={{ position: 'absolute', top: '15px', right: '35px', color: 'white', fontSize: '50px', cursor: 'pointer', zIndex: 2002 }}>&times;</span>
          <div onClick={prevImg} style={arrowStyle('left')}>&#10094;</div>
          <img src={images[lightboxIndex]} alt="Ingrandimento" style={{ maxWidth: '75%', maxHeight: '85vh', borderRadius: '10px', objectFit: 'contain', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()} />
          <div onClick={nextImg} style={arrowStyle('right')}>&#10095;</div>
        </div>
      )}

    </div>
  )
}

const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: '5%',
  color: 'white', fontSize: '40px', cursor: 'pointer', userSelect: 'none',
  padding: '15px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px',
  backdropFilter: 'blur(5px)', transition: 'background-color 0.3s ease', zIndex: 2001
});