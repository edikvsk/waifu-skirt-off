import React, { useEffect, useState, useRef } from 'react';
import { useSceneRotation } from '../hooks/useSceneRotation';
import { useSpeedMeter } from '../hooks/useSpeedMeter';
import { useBallAnimation } from '../hooks/useBallAnimation';
import UIControls from './UIControls';
import Environment3D from './Environment3D';
import Character from './Character';
import Ball from './Ball';
import BaseballPlayer from './BaseballPlayer';

const Scene = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windLevel, setWindLevel] = useState(1);
  const [scale, setScale] = useState(1);
  
  // Custom hooks
  const { rotation, containerRef } = useSceneRotation();
  const { speedValue, setSpeedPaused, speedPaused } = useSpeedMeter();
  const { ballRef, ballAnimating, animateBall, reverseBall, ballPosition } = useBallAnimation(speedValue, setSpeedPaused);
  
  // Ref for baseball player swing function
  const baseballPlayerRef = useRef(null);
  const isSwingingRef = useRef(false);
  const gameContainerRef = useRef(null);

  // Масштабирование игрового контейнера как в играх
  useEffect(() => {
    const updateScale = () => {
      if (!gameContainerRef.current) return;
      
      const baseWidth = 1920;
      const baseHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const scaleX = windowWidth / baseWidth;
      const scaleY = windowHeight / baseHeight;
      
      // Используем меньший масштаб для сохранения пропорций
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const girlImg = new Image();
    girlImg.src = '/layer_girl.png';
    girlImg.onload = () => setImageLoaded(true);
  }, []);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const setWindLevelAndAnimate = (level) => {
    setWindLevel(level);
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  const swingBat = () => {
    if (baseballPlayerRef.current && baseballPlayerRef.current.swingBat) {
      baseballPlayerRef.current.swingBat();
      isSwingingRef.current = true;
      
      // Проверка коллизии во время взмаха
      setTimeout(() => {
        isSwingingRef.current = false;
      }, 700); // Длительность всего взмаха
    }
  };

  const checkCollision = () => {
    if (!baseballPlayerRef.current || !ballAnimating || !isSwingingRef.current) return;
    
    const batPos = baseballPlayerRef.current.getBatPosition();
    const ballPos = ballPosition.current;
    
    // Проверка расстояния между шаром и битой
    const distance = Math.sqrt(
      Math.pow(ballPos.x - batPos.x, 2) + 
      Math.pow(ballPos.y - batPos.y, 2)
    );
    
    // Если расстояние меньше 100px и шар находится в зоне биты - отскок
    if (distance < 100 && ballPos.x > 768 && ballPos.x < 1536) {
      reverseBall();
      isSwingingRef.current = false; // Предотвращаем множественные отскоки
    }
  };

  // Непрерывная проверка коллизии во время полета шара
  useEffect(() => {
    if (!ballAnimating) return;
    
    const checkInterval = setInterval(checkCollision, 16); // ~60fps
    
    return () => clearInterval(checkInterval);
  }, [ballAnimating]);

  return (
    <>
      {/* UI слой - кнопки и шкала скорости */}
      <UIControls
        windLevel={windLevel}
        isAnimating={isAnimating}
        ballAnimating={ballAnimating}
        speedValue={speedValue}
        onWindLevelChange={setWindLevelAndAnimate}
        onToggleAnimation={toggleAnimation}
        onAnimateBall={animateBall}
        onSwingBat={swingBat}
      />
      
      {/* Игровой контейнер с фиксированным размером */}
      <div 
        ref={gameContainerRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: '1920px',
          height: '1080px',
          transformOrigin: 'center center',
          overflow: 'hidden'
        }}
      >
        {/* 3D сцена */}
        <div 
          ref={containerRef}
          className="skirt-animation-container"
          style={{
            transform: `rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
            width: '100%',
            height: '100%'
          }}
        >
          {/* 3D окружение (пол) */}
          <Environment3D />
          
          {/* Персонаж с дочерними элементами */}
          <Character
            imageLoaded={imageLoaded}
            isAnimating={isAnimating}
            windLevel={windLevel}
            sceneRotation={rotation}
          >
            <Ball ref={ballRef} />
          </Character>
          
          {/* Бейсболист справа */}
          <BaseballPlayer 
            ref={baseballPlayerRef}
            sceneRotation={rotation}
          />
        </div>
      </div>
    </>
  );
};

export default Scene;
