import { useState, useRef } from 'react';
import { gsap } from 'gsap';

export const useItemAnimation = (speedValue, setSpeedPaused, currentLevel) => {
  const itemRef = useRef(null);
  const [itemAnimating, setItemAnimating] = useState(false);
  const itemPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  const animateItem = () => {
    if (!itemRef.current || itemAnimating) return;

    setItemAnimating(true);
    setSpeedPaused(true);

    // Вычисляем длительность полёта на основе скорости (как у шара, но медленнее)
    const duration = 3.5 - (speedValue / 100) * 2.0;

    // Случайное количество волн (2, 3 или 4)
    const waveCount = Math.floor(Math.random() * 3) + 2;

    // Зеркальное отражение для 4 волн
    const isInverted = waveCount === 4;

    // Амплитуда зависит от уровня
    const amplitude = currentLevel === 2 ? 200 : 150;

    // Сбрасываем позицию предмета влево
    gsap.set(itemRef.current, { x: '-2000px', opacity: 1, rotation: 0 });

    // Анимация полёта предмета слева направо с синусоидальным движением
    animationRef.current = gsap.to(itemRef.current, {
      x: '2400px',
      rotation: 720,
      duration: duration,
      ease: 'power1.inOut',
      onStart: function() {
        // Сдвигаем всю траекторию правее на 400px
        gsap.set(itemRef.current, { x: '-1600px' });
      },
      onUpdate: function() {
        if (itemRef.current) {
          const progress = this.progress();
          // Синусоидальное движение по Y (как у шара)
          const yOffset = Math.sin(progress * Math.PI * waveCount) * amplitude * (isInverted ? -1 : 1);
          gsap.set(itemRef.current, { y: yOffset });

          const rect = itemRef.current.getBoundingClientRect();
          itemPosition.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      },
      onComplete: () => {
        setItemAnimating(false);
        setSpeedPaused(false);
      }
    });
  };

  const reverseItem = () => {
    if (!itemRef.current || !animationRef.current) return;

    gsap.killTweensOf(itemRef.current);
    animationRef.current = null;

    const currentX = gsap.getProperty(itemRef.current, 'x');
    const currentY = gsap.getProperty(itemRef.current, 'y');

    gsap.set(itemRef.current, { x: currentX, y: currentY });

    const duration = 3 - (speedValue / 100) * 2.0;

    animationRef.current = gsap.to(itemRef.current, {
      x: '-2000px',
      y: currentY,
      duration: duration * 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        if (itemRef.current) {
          const rect = itemRef.current.getBoundingClientRect();
          itemPosition.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      },
      onComplete: () => {
        setItemAnimating(false);
        setSpeedPaused(false);
      }
    });
  };

  const pauseItem = () => {
    if (!itemRef.current || !animationRef.current) return;

    gsap.killTweensOf(itemRef.current);
    animationRef.current = null;

    const currentX = gsap.getProperty(itemRef.current, 'x');
    const currentY = gsap.getProperty(itemRef.current, 'y');

    gsap.set(itemRef.current, { x: currentX, y: currentY });

    // Обновляем позицию один раз
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      itemPosition.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  };

  return { itemRef, itemAnimating, animateItem, reverseItem, pauseItem, itemPosition };
};
