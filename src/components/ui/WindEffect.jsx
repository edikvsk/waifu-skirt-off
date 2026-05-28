import React from 'react';

const WindEffect = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <>
      {/* Горизонтальные линии ветра */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: '30%',
            top: `${40 + i * 8}%`,
            width: '200px',
            height: '2px',
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent)',
            zIndex: 1400,
            pointerEvents: 'none',
            animation: `windLine 0.8s ease-out ${i * 0.1}s forwards`
          }}
        />
      ))}

      {/* Кривые линии ветра */}
      {[0, 1, 2].map((i) => (
        <div
          key={`curve-${i}`}
          style={{
            position: 'fixed',
            left: '35%',
            top: `${45 + i * 10}%`,
            width: '150px',
            height: '30px',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            zIndex: 1400,
            pointerEvents: 'none',
            animation: `windCurve 1s ease-out ${i * 0.15}s forwards`
          }}
        />
      ))}

      {/* Частицы ветра */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'fixed',
            left: `${30 + Math.random() * 30}%`,
            top: `${35 + Math.random() * 25}%`,
            width: '4px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            zIndex: 1400,
            pointerEvents: 'none',
            animation: `windParticle 1.2s ease-out ${i * 0.08}s forwards`
          }}
        />
      ))}
    </>
  );
};

export default WindEffect;
