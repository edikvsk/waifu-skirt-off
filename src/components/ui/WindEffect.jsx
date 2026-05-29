import React from 'react';

const WindEffect = ({ isActive, windLevel }) => {
  if (!isActive) return null;

  // Настройки интенсивности для разных уровней ветра
  const intensity = {
    1: { // Низкая скорость
      lines: 3,
      curves: 1,
      particles: 4,
      lineOpacity: 0.3,
      curveOpacity: 0.2,
      particleOpacity: 0.4,
      lineWidth: '150px',
      particleSize: '3px'
    },
    2: { // Средняя скорость (текущий эффект)
      lines: 6,
      curves: 3,
      particles: 10,
      lineOpacity: 0.6,
      curveOpacity: 0.4,
      particleOpacity: 0.7,
      lineWidth: '200px',
      particleSize: '4px'
    },
    3: { // Высокая скорость
      lines: 10,
      curves: 5,
      particles: 15,
      lineOpacity: 0.8,
      curveOpacity: 0.6,
      particleOpacity: 0.9,
      lineWidth: '250px',
      particleSize: '5px'
    }
  };

  const config = intensity[windLevel] || intensity[2];

  return (
    <>
      {/* Горизонтальные линии ветра */}
      {[...Array(config.lines)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: '30%',
            top: `${40 + i * 8}%`,
            width: config.lineWidth,
            height: '2px',
            background: `linear-gradient(to right, transparent, rgba(255, 255, 255, ${config.lineOpacity}), transparent)`,
            zIndex: 1400,
            pointerEvents: 'none',
            animation: `windLine 0.8s ease-out ${i * 0.1}s forwards`
          }}
        />
      ))}

      {/* Кривые линии ветра */}
      {[...Array(config.curves)].map((_, i) => (
        <div
          key={`curve-${i}`}
          style={{
            position: 'fixed',
            left: '35%',
            top: `${45 + i * 10}%`,
            width: '150px',
            height: '30px',
            border: `2px solid rgba(255, 255, 255, ${config.curveOpacity})`,
            borderRadius: '50%',
            zIndex: 1400,
            pointerEvents: 'none',
            animation: `windCurve 1s ease-out ${i * 0.15}s forwards`
          }}
        />
      ))}

      {/* Частицы ветра */}
      {[...Array(config.particles)].map((_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'fixed',
            left: `${30 + Math.random() * 30}%`,
            top: `${35 + Math.random() * 25}%`,
            width: config.particleSize,
            height: config.particleSize,
            background: `rgba(255, 255, 255, ${config.particleOpacity})`,
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
