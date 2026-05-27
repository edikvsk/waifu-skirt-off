import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { gsap } from 'gsap';

const BaseballPlayer = forwardRef(({ sceneRotation }, ref) => {
  const batRef = useRef(null);
  const playerRef = useRef(null);
  const batPosition = useRef({ x: 0, y: 0, angle: 0 });
  const [isHitting, setIsHitting] = useState(false);

  const swingBat = () => {
    if (!batRef.current) return;

    // Переключаем на hit спрайт
    setIsHitting(true);

    // Анимация взмаха битой
    const tl = gsap.timeline();

    // Исходная позиция
    gsap.set(batRef.current, { rotation: 45 });

    // Взмах назад
    tl.to(batRef.current, {
      rotation: 90,
      duration: 0.2,
      ease: 'power2.in',
      onUpdate: () => {
        updateBatPosition();
      }
    }, 0);

    // Быстрый взмах вперёд
    tl.to(batRef.current, {
      rotation: -90,
      duration: 0.15,
      ease: 'power4.out',
      onUpdate: () => {
        updateBatPosition();
      }
    }, 0.2);

    // Возврат в исходную позицию
    tl.to(batRef.current, {
      rotation: 45,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        updateBatPosition();
      }
    }, 0.35);

    // Возвращаемся к idle спрайту после завершения анимации
    tl.call(() => {
      setIsHitting(false);
    }, null, 0.5);
  };

  const updateBatPosition = () => {
    if (!batRef.current) return;
    const rect = batRef.current.getBoundingClientRect();
    const rotation = gsap.getProperty(batRef.current, 'rotation') || 45;
    batPosition.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      angle: rotation
    };
  };

  // Экспонируем метод swingBat и позицию биты через ref
  useImperativeHandle(ref, () => ({
    swingBat,
    getBatPosition: () => batPosition.current
  }));

  // Контр-вращение бейсболиста для создания объёма
  React.useEffect(() => {
    if (!playerRef.current || !sceneRotation) return;
    
    const counterRotateY = -sceneRotation.y * 0.5;
    playerRef.current.style.transform = `rotateY(${counterRotateY}deg)`;
  }, [sceneRotation]);

  return (
    <div 
      ref={playerRef}
      style={{
        position: 'absolute',
        right: '-100px',
        bottom: '0',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Тень под бейсболистом */}
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        left: '450px',
        transform: 'translateX(-50%) rotateX(60deg)',
        width: '150px',
        height: '40px',
        background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%)',
        filter: 'blur(8px)',
        zIndex: 0
      }} />
      
      {/* Бейсболист (спрайты) */}
      <div style={{
        position: 'relative',
        width: '770px',
        height: '1050px',
        zIndex: 1,
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
      }}>
        <img 
          src={isHitting ? '/batter_hit_low.png' : '/batter_idle.png'}
          alt="Baseball Player"
          style={{
            width: '1000px',
            height: '1200px',
            objectFit: 'contain',
            position: 'absolute',
            top: '0',
            left: '0'
          }}
        />
        
        {/* Бита (скрыта, так как она уже есть на спрайтах) */}
        <div 
          ref={batRef}
          style={{
            position: 'absolute',
            top: '60px',
            left: '-30px',
            width: '12px',
            height: '120px',
            background: 'linear-gradient(90deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)',
            borderRadius: '6px',
            transformOrigin: 'top center',
            transform: 'rotate(45deg)',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            opacity: 0
          }}
        />
      </div>
    </div>
  );
});

BaseballPlayer.displayName = 'BaseballPlayer';

export default BaseballPlayer;
