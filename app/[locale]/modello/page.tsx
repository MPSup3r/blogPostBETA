'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import '../style.css'

const ModelViewer = (props: React.HTMLAttributes<HTMLElement> & {
  src?: string;
  'auto-rotate'?: boolean | string;
  'camera-controls'?: boolean | string;
  'shadow-intensity'?: string | number;
  'camera-orbit'?: string;
}) => {
  return React.createElement('model-viewer', props);
};

export default function ModelloPage() {
  const [zoom, setZoom] = useState(150);

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js'
    document.head.appendChild(script)
    return () => { if (document.head.contains(script)) document.head.removeChild(script) }
  }, [])

  const zoomIn = () => setZoom((prev) => Math.max(60, prev - 20));
  const zoomOut = () => setZoom((prev) => Math.min(250, prev + 20));

  return (
    <div className="vetrina-wrapper" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-alt)', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <ModelViewer
          src="/MechaVersion0_1.glb"
          auto-rotate="true"
          camera-controls="true"
          shadow-intensity="1"
          camera-orbit={`0deg 75deg ${zoom}%`}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, outline: 'none' }}
        />

        {/* Pulsanti Zoom in basso a destra (usano il CSS ripristinato) */}
        <div className="custom-controls">
          <button onClick={zoomIn} className="control-btn" title="Zoom In">+</button>
          <button onClick={zoomOut} className="control-btn" title="Zoom Out">-</button>
        </div>

        {/* TASTO "TORNA ALLA HOME" (Centrato in basso a mezz'aria) */}
        <div style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 10 
        }}>
          <Link href="/" className="minimal-3d-link" style={{ position: 'relative', bottom: 'auto' }}>
            <span>←</span> Torna alla Home
          </Link>
        </div>
      </div>
      
    </div>
  )
}