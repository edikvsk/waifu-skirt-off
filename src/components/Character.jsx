import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSpriteAnimation } from '../hooks/useSpriteAnimation';

const Character = ({ imageLoaded, isAnimating, windLevel, children, sceneRotation, speedLevel, currentLevel, animationTrigger, onSkirtSequenceStart, onSkirtSequenceEnd, isBallSequenceActive, sequenceCompleted, animScale = 1, animPosX = 0, animPosY = 0, onAnimationPlayingChange }) => {
  const skirtRef = useRef(null);
  const timelineRef = useRef(null);
  const characterRef = useRef(null);
  const [isSurprise, setIsSurprise] = useState(false);
  const [skirtDropped, setSkirtDropped] = useState(false);

  // Хук для спрайтовой анимации (только для уровня 1)
  const { currentFrame, isPlaying: isSpritePlaying, isLoaded: isSpriteLoaded, frames } = useSpriteAnimation(
    currentLevel,
    'walk',
    'ball',
    isBallSequenceActive
  );

  // Анимация движения по X для уровня 1
  const animMoveRef = useRef(null);
  const [currentAnimX, setCurrentAnimX] = useState(animPosX);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animOpacity, setAnimOpacity] = useState(1);
  const [baseOpacity, setBaseOpacity] = useState(1);

  useEffect(() => {
    if (currentLevel === 1 && isSpritePlaying && isSpriteLoaded && frames.length > 0) {
      setShowAnimation(true);
      setAnimOpacity(1);
      setBaseOpacity(0);
      setCurrentAnimX(-1200); // Начальная позиция

      // Уведомляем Scene что анимация началась
      if (onAnimationPlayingChange) {
        onAnimationPlayingChange(true);
      }

      // Запускаем анимацию движения от -1200 до -200
      animMoveRef.current = gsap.to(
        { x: -1200 },
        {
          x: -200,
          duration: 3,
          ease: 'none',
          onUpdate: function() {
            setCurrentAnimX(this.targets()[0].x);
          },
          onComplete: () => {
            // Очень короткий fade для естественности без эффекта призрака
            gsap.to({}, {
              duration: 0.1,
              onUpdate: function() {
                const progress = this.progress();
                setAnimOpacity(1 - progress);
                setBaseOpacity(progress);
              },
              onComplete: () => {
                setShowAnimation(false);
                setAnimOpacity(1);
                setBaseOpacity(1);
                // Уведомляем Scene что анимация закончилась
                if (onAnimationPlayingChange) {
                  onAnimationPlayingChange(false);
                }
              }
            });
          }
        }
      );
    } else {
      // Сбрасываем позицию когда анимация не играет
      if (animMoveRef.current) {
        gsap.killTweensOf(animMoveRef.current);
        animMoveRef.current = null;
      }
      setCurrentAnimX(animPosX);
      setShowAnimation(false);
      setAnimOpacity(1);
      // Если кнопка BALL видна (isBallSequenceActive = false) и последовательность не завершена, скрываем спрайт
      setBaseOpacity(currentLevel === 1 && !isBallSequenceActive && !sequenceCompleted ? 0 : 1);
      // Уведомляем Scene что анимация не играет
      if (onAnimationPlayingChange) {
        onAnimationPlayingChange(false);
      }
    }

    return () => {
      if (animMoveRef.current) {
        gsap.killTweensOf(animMoveRef.current);
      }
    };
  }, [isSpritePlaying, isSpriteLoaded, frames.length, currentLevel, isBallSequenceActive, onAnimationPlayingChange]);

  useEffect(() => {
    if (!imageLoaded || !skirtRef.current) return;

    // Эксклюзивная анимация для уровня 4 - сползание юбки вниз без деформации
    if (currentLevel === 4) {
      // Если юбка уже упала, не анимируем снова
      if (skirtDropped) {
        // Устанавливаем текущую позицию юбки в опущенное состояние
        const currentSlideAmount = 250; // Максимальное падение
        gsap.set(skirtRef.current, { y: currentSlideAmount });
        return;
      }

      // Определяем смещение вниз в зависимости от скорости шара
      const slideAmount = speedLevel === 'high' ? 250 : speedLevel === 'normal' ? 20 : 10;
      const slideDuration = speedLevel === 'high' ? 0.8 : speedLevel === 'normal' ? 1.0 : 1.2;

      const tl = gsap.timeline({ repeat: 0, paused: !isAnimating });

      // При high скорости - полная последовательность с паузой игры
      if (speedLevel === 'high' && isAnimating) {
        if (onSkirtSequenceStart) onSkirtSequenceStart();

        // 1. Падение юбки
        tl.to(skirtRef.current, {
          y: slideAmount,
          duration: slideDuration,
          ease: 'power1.inOut',
          onComplete: () => {
            setSkirtDropped(true);
          }
        }, 0);

        // 2. Смена на surprise спрайт после падения
        tl.call(() => {
          setIsSurprise(true);
        }, null, slideDuration);

        // 3. Удержание surprise спрайта 1.5 секунды
        tl.to({}, { duration: 1.5 }, slideDuration);

        // 4. Уведомление о завершении последовательности (surprise остается)
        tl.call(() => {
          if (onSkirtSequenceEnd) onSkirtSequenceEnd();
        }, null, slideDuration + 1.5);
      } else {
        // Для normal и slow - простое сползание без фиксации
        tl.to(skirtRef.current, {
          y: slideAmount,
          duration: slideDuration,
          ease: 'power1.inOut'
        }, 0);
      }

      timelineRef.current = tl;

      // Минимальная волна clip-path для уровня 4
      const animateClipPath = () => {
        if (!isAnimating || !skirtRef.current) {
          requestAnimationFrame(animateClipPath);
          return;
        }

        const time = Date.now() * 0.001;
        const wave1 = Math.sin(time * 2) * 1; // Уменьшенная амплитуда
        const wave2 = Math.sin(time * 3 + 1) * 0.5;
        const wave3 = Math.sin(time * 1.5 + 2) * 1;

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
    }

    // Стандартная анимация для уровней 1-3
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
  }, [imageLoaded, windLevel, isAnimating, animationTrigger, currentLevel, speedLevel]);

  // Управление воспроизведением анимации
  useEffect(() => {
    if (timelineRef.current) {
      if (isAnimating) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
        // Сбрасываем surprise только если не уровень 4
        if (currentLevel !== 4) {
          setIsSurprise(false);
        }
      }
    }
  }, [isAnimating, currentLevel]);

  // Контр-вращение персонажа для создания объёма (billboarding эффект)
  useEffect(() => {
    if (!characterRef.current || !sceneRotation) return;

    // Применяем контр-вращение по оси Y, чтобы персонаж оставался более лицевым к камере
    // Используем 50% от вращения сцены для создания эффекта объёма
    const counterRotateY = -sceneRotation.y * 0.5;

    characterRef.current.style.transform = `rotateY(${counterRotateY}deg)`;
  }, [sceneRotation]);

  // Определяем спрайт в зависимости от уровня скорости и уровня игры
  const getGirlSprite = () => {
    if (isSurprise && currentLevel === 4) {
      return '/layer_girl_surprise_4.png';
    }
    const suffix = currentLevel === 2 ? '_2' : currentLevel === 3 ? '_3' : currentLevel === 4 ? '_4' : currentLevel === 5 ? '_5' : '';
    switch (speedLevel) {
      case 'high':
        return `/layer_girl_fast${suffix}.png`;
      case 'normal':
        return `/layer_girl_medium${suffix}.png`;
      default:
        if (currentLevel === 2) return '/layer_girl_slow_2.png';
        if (currentLevel === 3) return '/layer_girl_slow_3.png';
        if (currentLevel === 4) return '/layer_girl_slow_4.png';
        if (currentLevel === 5) return '/layer_girl_slow_5.png';
        return '/layer_girl.png';
    }
  };

  // Определяем спрайт юбки в зависимости от уровня игры
  const getSkirtSprite = () => {
    if (currentLevel === 2) return '/layer_skirt_2.png';
    if (currentLevel === 3) return '/layer_skirt_3.png';
    if (currentLevel === 4) return '/layer_skirt_4.png';
    if (currentLevel === 5) return '/layer_skirt_5.png';
    return '/layer_skirt.png';
  };

  // Конфигурация позиционирования юбки для каждого уровня
  const getSkirtPosition = () => {
    switch (currentLevel) {
      case 1:
        return { top: '37%', left: '47%', scaleX: '1.05', maxHeight: '120px' };
      case 2:
        return { top: '37%', left: '47%', scaleX: '1.35', maxHeight: '120px' };
      case 3:
        return { top: '37%', left: '40%', scaleX: '0.83', maxHeight: '117px' };
      case 4:
        return { top: '31%', left: '47%', scaleX: '1.25', maxHeight: '150px' };
      case 5:
        return { top: '31%', left: '56%', scaleX: '1.35', maxHeight: '158px' };
      default:
        return { top: '37%', left: '47%', scaleX: '1.05', maxHeight: '120px' };
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
      <div
        className="girl-shadow"
        style={{
          opacity: currentLevel === 1 ? baseOpacity : 1
        }}
      ></div>
      
      {/* Дочерние элементы (объекты, шары и т.д.) */}
      {children}
      
      {/* Базовое изображение персонажа */}
      <img
        src={getGirlSprite()}
        alt="Character"
        className={`base-image ${currentLevel === 4 ? 'sun-glow-character' : ''}`}
        style={{
          position: 'relative',
          zIndex: 1,
          maxHeight: currentLevel === 2 ? 'auto' : currentLevel === 3 ? 'auto' : currentLevel === 4 ? 'auto' : currentLevel === 5 ? 'auto' : '500px',
          height: currentLevel === 2 ? '500px' : currentLevel === 3 ? '517px' : currentLevel === 4 ? '500px' : currentLevel === 5 ? '525px' : 'auto',
          width: 'auto',
          display: 'block',
          opacity: currentLevel === 1 ? baseOpacity : 1,
          filter: currentLevel === 2
            ? 'drop-shadow(0 0 10px rgba(255, 0, 102, 0.4)) drop-shadow(0 0 20px rgba(255, 0, 102, 0.2)) drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
            : currentLevel === 4
            ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
            : currentLevel === 5
            ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
            : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
        }}
      />

      {/* Спрайтовая анимация поверх основного спрайта (только для уровня 1) */}
      {currentLevel === 1 && showAnimation && isSpriteLoaded && frames.length > 0 && (
        <img
          src={frames[currentFrame]}
          alt="Animation"
          style={{
            position: 'absolute',
            top: -72,
            left: currentAnimX,
            zIndex: 1.5,
            maxHeight: currentLevel === 2 ? 'auto' : currentLevel === 3 ? 'auto' : currentLevel === 4 ? 'auto' : currentLevel === 5 ? 'auto' : '500px',
            height: currentLevel === 2 ? '500px' : currentLevel === 3 ? '517px' : currentLevel === 4 ? '500px' : currentLevel === 5 ? '525px' : 'auto',
            width: 'auto',
            pointerEvents: 'none',
            opacity: animOpacity,
            transform: `scale(1.42)`
          }}
        />
      )}

      {/* Юбка поверх персонажа - позиционируется на талии */}
      <img
        ref={skirtRef}
        src={getSkirtSprite()}
        alt="Skirt"
        className="skirt-image"
        style={{
          position: 'absolute',
          top: getSkirtPosition().top,
          left: getSkirtPosition().left,
          transform: `translateX(-50%) scaleX(${getSkirtPosition().scaleX})`,
          maxHeight: getSkirtPosition().maxHeight,
          width: 'auto',
          zIndex: 2,
          transformOrigin: 'top center',
          pointerEvents: 'none',
          opacity: currentLevel === 1 ? baseOpacity : 1,
          filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))'
        }}
      />
    </div>
  );
};

export default Character;
