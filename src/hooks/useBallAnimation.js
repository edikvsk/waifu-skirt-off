import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { collisionConfig } from '../config/collisionConfig';

export const useBallAnimation = (speedValue, setSpeedPaused, currentLevel) => {
  const ballRef = useRef(null);
  const [ballAnimating, setBallAnimating] = useState(false);
  const ballPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  const animateBall = () => {
    if (!ballRef.current || ballAnimating) return;

    setBallAnimating(true);
    setSpeedPaused(true); // Останавливаем шкалу скорости

    // Вычисляем длительность полёта на основе скорости (чем выше скорость, тем быстрее полёт)
    // Скорость 0 = 3 секунды, скорость 100 = 1 секунда
    const duration = 3 - (speedValue / 100) * 2.0;

    // Случайное количество волн (2, 3 или 4)
    const waveCount = Math.floor(Math.random() * 3) + 2;

    // Зеркальное отражение для 4 волн
    const isInverted = waveCount === 4;

    // Амплитуда зависит от уровня (во втором уровне шары летят выше)
    const amplitude = currentLevel === 2 ? 200 : 150;

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
          // Синусоидальное движение по Y (амплитуда зависит от уровня, случайное количество волн)
          const yOffset = Math.sin(progress * Math.PI * waveCount) * amplitude * (isInverted ? -1 : 1);
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

    // Полностью останавливаем все анимации шара
    gsap.killTweensOf(ballRef.current);
    animationRef.current = null;

    // Получаем текущие GSAP свойства
    const currentX = gsap.getProperty(ballRef.current, 'x');
    const currentY = gsap.getProperty(ballRef.current, 'y');

    // Мгновенно фиксируем текущую позицию
    gsap.set(ballRef.current, { x: currentX, y: currentY });

    // Запускаем анимацию в обратном направлении с параметрами из конфигурации
    const duration = 3 - (speedValue / 100) * 2.0;

    animationRef.current = gsap.to(ballRef.current, {
      x: '-2000px',
      y: currentY,
      duration: duration * collisionConfig.rebound.speedMultiplier,
      ease: collisionConfig.rebound.ease,
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
