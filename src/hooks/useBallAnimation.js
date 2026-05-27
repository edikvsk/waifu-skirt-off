import { useState, useRef } from 'react';
import { gsap } from 'gsap';

export const useBallAnimation = (speedValue, setSpeedPaused) => {
  const ballRef = useRef(null);
  const [ballAnimating, setBallAnimating] = useState(false);
  const ballPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  const animateBall = () => {
    if (!ballRef.current || ballAnimating) return;
    
    setBallAnimating(true);
    setSpeedPaused(true); // Останавливаем шкалу скорости
    
    // Вычисляем длительность полёта на основе скорости (чем выше скорость, тем быстрее полёт)
    // Скорость 0 = 3 секунды, скорость 100 = 0.5 секунды
    const duration = 3 - (speedValue / 100) * 2.5;
    
    // Сбрасываем позицию шара влево
    gsap.set(ballRef.current, { x: '-2000px', opacity: 1 });
    
    // Анимация полёта шара слева направо с отслеживанием позиции
    animationRef.current = gsap.to(ballRef.current, {
      x: '2000px',
      duration: duration,
      ease: 'power1.inOut',
      onUpdate: function() {
        if (ballRef.current) {
          const progress = this.progress();
          // Синусоидальное движение по Y (амплитуда 150px, 3 волны)
          const yOffset = Math.sin(progress * Math.PI * 3) * 150;
          gsap.set(ballRef.current, { y: yOffset });
          
          const rect = ballRef.current.getBoundingClientRect();
          ballPosition.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      },
      onComplete: () => {
        setBallAnimating(false);
        setSpeedPaused(false); // Возобновляем шкалу скорости
      }
    });
  };

  const reverseBall = () => {
    if (!ballRef.current || !animationRef.current) return;
    
    // Останавливаем текущую анимацию
    animationRef.current.kill();
    
    // Запускаем анимацию в обратном направлении
    const duration = 3 - (speedValue / 100) * 2.5;
    
    animationRef.current = gsap.to(ballRef.current, {
      x: '-2000px',
      duration: duration * 0.8,
      ease: 'power1.inOut',
      onUpdate: function() {
        if (ballRef.current) {
          const rect = ballRef.current.getBoundingClientRect();
          ballPosition.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      },
      onComplete: () => {
        setBallAnimating(false);
        setSpeedPaused(false);
      }
    });
  };

  return { ballRef, ballAnimating, animateBall, reverseBall, ballPosition };
};
