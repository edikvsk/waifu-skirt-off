import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Character = ({ imageLoaded, isAnimating, windLevel, children, sceneRotation, speedLevel }) => {
  const skirtRef = useRef(null);
  const timelineRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    if (!imageLoaded || !skirtRef.current) return;

    // Определяем параметры анимации в зависимости от уровня ветра
    const windLevels = {
      1: { scaleY: 0.85, rotation: 1.5, skewX: 1.5, y: 2, duration: 1.2 },
      2: { scaleY: 0.55, rotation: 2, skewX: 2, y: 3, duration: 1.0 },
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
  }, [imageLoaded, windLevel, isAnimating]);

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

  // Контр-вращение персонажа для создания объёма (billboarding эффект)
  useEffect(() => {
    if (!characterRef.current || !sceneRotation) return;

    // Применяем контр-вращение по оси Y, чтобы персонаж оставался более лицевым к камере
    // Используем 50% от вращения сцены для создания эффекта объёма
    const counterRotateY = -sceneRotation.y * 0.5;

    characterRef.current.style.transform = `rotateY(${counterRotateY}deg)`;
  }, [sceneRotation]);

  // Определяем спрайт в зависимости от уровня скорости
  const getGirlSprite = () => {
    switch (speedLevel) {
      case 'high':
        return '/layer_girl_fast.png';
      case 'normal':
        return '/layer_girl_medium.png';
      default:
        return '/layer_girl.png';
    }
  };

  return (
    <div 
      ref={characterRef}
      className="character-container" 
      style={{ 
        position: 'relative', 
        display: 'inline-block', 
        marginBottom: '250px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Тень под персонажем */}
      <div className="girl-shadow"></div>
      
      {/* Дочерние элементы (объекты, шары и т.д.) */}
      {children}
      
      {/* Базовое изображение персонажа */}
      <img
        src={getGirlSprite()}
        alt="Character"
        className="base-image"
        style={{
          position: 'relative',
          zIndex: 1,
          maxHeight: '550px',
          width: 'auto',
          display: 'block',
          filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
        }}
      />
      
      {/* Юбка поверх персонажа - позиционируется на талии */}
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
          maxHeight: '132px',
          width: 'auto',
          zIndex: 2,
          transformOrigin: 'top center',
          pointerEvents: 'none',
          filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))'
        }}
      />
    </div>
  );
};

export default Character;
