import React from 'react';

const HitEffect = ({ isActive, position }) => {
  if (!isActive || !position) return null;

  return (
    <>
      {/* Вспышка удара */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.6) 0%, transparent 40%)',
        zIndex: 1500,
        pointerEvents: 'none',
        animation: 'hitFlash 0.15s ease-out forwards'
      }} />

      {/* Аниме линии скорости */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y - 80,
        transform: 'translate(-50%, -50%)',
        zIndex: 1600,
        pointerEvents: 'none'
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '3px',
              height: '80px',
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)',
              transformOrigin: 'bottom center',
              transform: `rotate(${i * 45}deg) translateY(-40px)`,
              animation: `speedLine 0.3s ease-out ${i * 0.02}s forwards`
            }}
          />
        ))}
      </div>

      {/* Эффект удара - угловатая форма */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y - 80,
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        zIndex: 1700,
        pointerEvents: 'none',
        animation: 'animeImpact 0.4s ease-out forwards'
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon
            points="60,10 90,30 110,60 90,90 60,110 30,90 10,60 30,30"
            fill="none"
            stroke="#FFD700"
            strokeWidth="4"
            style={{
              animation: 'polygonPulse 0.4s ease-out forwards'
            }}
          />
          <polygon
            points="60,20 80,35 95,60 80,85 60,100 40,85 25,60 40,35"
            fill="rgba(255, 215, 61, 0.3)"
            stroke="#FF6B35"
            strokeWidth="2"
            style={{
              animation: 'polygonPulse 0.4s ease-out 0.05s forwards'
            }}
          />
        </svg>
      </div>

      {/* Текстовый эффект POW */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y - 120,
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Impact, sans-serif',
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#FFD700',
        textShadow: '3px 3px 0 #FF6B35, -1px -1px 0 #FF6B35, 1px -1px 0 #FF6B35, -1px 1px 0 #FF6B35',
        zIndex: 1800,
        pointerEvents: 'none',
        animation: 'textPop 0.4s ease-out forwards',
        whiteSpace: 'nowrap'
      }}>
        POW!
      </div>
    </>
  );
};

export default HitEffect;
