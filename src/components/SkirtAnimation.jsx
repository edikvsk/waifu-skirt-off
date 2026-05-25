import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SkirtAnimation = () => {
  const girlRef = useRef(null);
  const skirtRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windLevel, setWindLevel] = useState(1);
  const timelineRef = useRef(null);

  useEffect(() => {
    const girlImg = new Image();
    girlImg.src = '/layer_girl.png';
    girlImg.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (!imageLoaded || !skirtRef.current) return;

    // Определяем параметры анимации в зависимости от уровня ветра
    const windLevels = {
      1: { scaleY: 0.85, rotation: 1.5, skewX: 1.5, y: 2, duration: 2 },
      2: { scaleY: 0.55, rotation: 2, skewX: 2, y: 3, duration: 1.5 },
      3: { scaleY: 0.35, rotation: 3, skewX: 3, y: 5, duration: 1 }
    };

    const params = windLevels[windLevel];

    // Создаем реалистичную анимацию юбки с помощью трансформаций
    const tl = gsap.timeline({ repeat: 0, yoyo: true, paused: !isAnimating });

    // Основная волна юбки - только нижняя часть
    tl.to(skirtRef.current, {
      rotation: params.rotation,
      skewX: -params.skewX,
      duration: params.duration * 1.5,
      ease: 'sine.inOut'
    }, 0);

    tl.to(skirtRef.current, {
      rotation: -params.rotation,
      skewX: params.skewX,
      duration: params.duration * 1.5,
      ease: 'sine.inOut'
    }, params.duration * 0.75);

    // Вертикальное движение только нижней части
    tl.to(skirtRef.current, {
      y: -params.y,
      duration: params.duration * 1.2,
      ease: 'power1.inOut'
    }, params.duration * 0.3);

    tl.to(skirtRef.current, {
      y: params.y * 0.7,
      duration: params.duration * 1.2,
      ease: 'power1.inOut'
    }, params.duration * 1.5);

    // Деформация высоты юбки (растяжение/сжатие от верхней точки)
    tl.to(skirtRef.current, {
      scaleY: 1.1,
      duration: params.duration,
      ease: 'sine.inOut'
    }, 0);

    tl.to(skirtRef.current, {
      scaleY: params.scaleY,
      duration: params.duration,
      ease: 'sine.inOut'
    }, params.duration);

    timelineRef.current = tl;

    // Анимация clip-path для волны только в нижней части
    const animateClipPath = () => {
      if (!isAnimating || !skirtRef.current) {
        requestAnimationFrame(animateClipPath);
        return;
      }

      const time = Date.now() * 0.001;
      const wave1 = Math.sin(time * 2) * 3;
      const wave2 = Math.sin(time * 3 + 1) * 2;
      const wave3 = Math.sin(time * 1.5 + 2) * 3;
      
      // Верхняя 25% остается неподвижной (резинка), волна только в нижней части
      const clipPath = `polygon(
        0% 0%,
        100% 0%,
        ${100 + wave2}% 25%,
        ${100 + wave3}% 100%,
        ${0 + wave1}% 100%,
        ${0 + wave1}% 25%
      )`;
      
      skirtRef.current.style.clipPath = clipPath;
      
      requestAnimationFrame(animateClipPath);
    };

    animateClipPath();

    return () => {
      tl.kill();
    };
  }, [imageLoaded, windLevel]);

  // Управление воспроизведением анимации
  useEffect(() => {
    if (timelineRef.current) {
      if (isAnimating) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    }
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const setWindLevelAndAnimate = (level) => {
    setWindLevel(level);
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  return (
    <div className="skirt-animation-container">
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button 
          onClick={() => setWindLevelAndAnimate(1)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 1 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 1
        </button>
        <button 
          onClick={() => setWindLevelAndAnimate(2)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 2 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 2
        </button>
        <button 
          onClick={() => setWindLevelAndAnimate(3)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 3 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 3
        </button>
        <button 
          onClick={toggleAnimation}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: isAnimating ? '#ff6b6b' : '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {isAnimating ? 'Стоп' : 'Старт'}
        </button>
      </div>
      
      <div className="girl-container" ref={girlRef} style={{ position: 'relative', display: 'inline-block' }}>
        {/* Базовое изображение девушки */}
        <img 
          src="/layer_girl.png" 
          alt="Girl" 
          className="base-image"
          style={{ 
            position: 'relative',
            zIndex: 1,
            maxHeight: '90vh',
            width: 'auto',
            display: 'block'
          }}
        />
        
        {/* Юбка поверх девушки - позиционируется на талии */}
        <img 
          ref={skirtRef}
          src="/layer_skirt.png" 
          alt="Skirt" 
          className="skirt-image"
          style={{ 
            position: 'absolute',
            top: '37%',
            left: '47%',
            transform: 'translateX(-50%) scaleX(1.05)',
            maxHeight: '20vh',
            width: 'auto',
            zIndex: 2,
            transformOrigin: 'top center',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default SkirtAnimation;
