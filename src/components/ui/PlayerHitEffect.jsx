import React from 'react';

const PlayerHitEffect = ({ isActive, position }) => {
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
        background: 'radial-gradient(circle at center, rgba(255, 0, 0, 0.5) 0%, transparent 50%)',
        zIndex: 1500,
        pointerEvents: 'none',
        animation: 'hitFlash 0.2s ease-out forwards'
      }} />

      {/* Аниме линии удара */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 1600,
        pointerEvents: 'none'
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '4px',
              height: '100px',
              background: 'linear-gradient(to top, rgba(255, 100, 100, 0.9), transparent)',
              transformOrigin: 'bottom center',
              transform: `rotate(${i * 30}deg) translateY(-50px)`,
              animation: `speedLine 0.4s ease-out ${i * 0.03}s forwards`
            }}
          />
        ))}
      </div>

      {/* Эффект удара - звезда/взрыв */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: '150px',
        height: '150px',
        zIndex: 1700,
        pointerEvents: 'none',
        animation: 'animeImpact 0.5s ease-out forwards'
      }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* Внешняя звезда */}
          <polygon
            points="75,5 90,55 140,55 100,85 115,135 75,105 35,135 50,85 10,55 60,55"
            fill="none"
            stroke="#FF0000"
            strokeWidth="5"
            style={{
              animation: 'polygonPulse 0.5s ease-out forwards'
            }}
          />
          {/* Внутренняя звезда */}
          <polygon
            points="75,25 85,60 120,60 95,80 105,115 75,95 45,115 55,80 30,60 65,60"
            fill="rgba(255, 0, 0, 0.4)"
            stroke="#FF6600"
            strokeWidth="3"
            style={{
              animation: 'polygonPulse 0.5s ease-out 0.1s forwards'
            }}
          />
        </svg>
      </div>

      {/* Текстовый эффект BAM! */}
      <div style={{
        position: 'fixed',
        left: position.x,
        top: position.y - 100,
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Impact, sans-serif',
        fontSize: '56px',
        fontWeight: 'bold',
        color: '#FF0000',
        textShadow: '4px 4px 0 #FF6600, -2px -2px 0 #FF6600, 2px -2px 0 #FF6600, -2px 2px 0 #FF6600',
        zIndex: 1800,
        pointerEvents: 'none',
        animation: 'textPop 0.5s ease-out forwards',
        whiteSpace: 'nowrap'
      }}>
        BAM!
      </div>
    </>
  );
};

export default PlayerHitEffect;
