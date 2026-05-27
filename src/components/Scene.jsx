import React, { useEffect, useState, useRef } from 'react';
import { useSceneRotation } from '../hooks/useSceneRotation';
import { useSpeedMeter } from '../hooks/useSpeedMeter';
import { useBallAnimation } from '../hooks/useBallAnimation';
import UIControls from './UIControls';
import Environment3D from './Environment3D';
import Character from './Character';
import Ball from './Ball';
import BaseballPlayer from './BaseballPlayer';
import { collisionConfig } from '../config/collisionConfig';
import { getElementGamePosition, calculateDistance } from '../utils/coordinateUtils';

const Scene = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windLevel, setWindLevel] = useState(1);
  const [scale, setScale] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [debugBatPos, setDebugBatPos] = useState({ x: 0, y: 0 });
  const [debugBallPos, setDebugBallPos] = useState({ x: 0, y: 0 });
  
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
      }, collisionConfig.swing.totalDuration); // Длительность всего взмаха из конфигурации
    }
  };

  const checkCollision = () => {
    if (!baseballPlayerRef.current || !ballAnimating || !isSwingingRef.current) return;

    const batPos = baseballPlayerRef.current.getBatPosition();
    const ballPos = ballPosition.current;

    // Проверка расстояния между шаром и битой с использованием конфигурации
    const distance = calculateDistance(ballPos.x, ballPos.y, batPos.x, batPos.y);
    const collisionRadius = collisionConfig.bat.radius;

    console.log('Проверка коллизии - Расстояние:', distance, 'Радиус:', collisionRadius, 'Шар X:', ballPos.x, 'Шар Y:', ballPos.y, 'Бита X:', batPos.x, 'Бита Y:', batPos.y);

    // Если расстояние меньше радиуса коллизии - отскок
    if (distance < collisionRadius) {
      console.log('КОЛЛИЗИЯ! Расстояние:', distance);
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

  // Отладочное обновление координат
  useEffect(() => {
    if (!debugMode) return;
    
    const updateDebugInfo = () => {
      if (baseballPlayerRef.current) {
        const batPos = baseballPlayerRef.current.getBatPosition();
        setDebugBatPos(batPos);
      }
      setDebugBallPos(ballPosition.current);
    };
    
    const interval = setInterval(updateDebugInfo, 16);
    return () => clearInterval(interval);
  }, [debugMode, ballAnimating]);

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

      {/* Кнопка отладочного режима */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          padding: '10px 20px',
          background: debugMode ? '#ff4444' : '#44ff44',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {debugMode ? 'Отладка ВЫКЛ' : 'Отладка ВКЛ'}
      </button>

      {/* Отладочный оверлей */}
      {debugMode && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#00ff00',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 1000,
            minWidth: '250px'
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
            🔧 ОТЛАДКА КОЛЛИЗИИ
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Бита:</strong><br />
            X: {Math.round(debugBatPos.x)} px<br />
            Y: {Math.round(debugBatPos.y)} px<br />
            Угол: {Math.round(debugBatPos.angle)}°
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Шар:</strong><br />
            X: {Math.round(debugBallPos.x)} px<br />
            Y: {Math.round(debugBallPos.y)} px
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Расстояние:</strong><br />
            {Math.round(Math.sqrt(
              Math.pow(debugBallPos.x - debugBatPos.x, 2) +
              Math.pow(debugBallPos.y - debugBatPos.y, 2)
            ))} px
          </div>
          <div>
            <strong>Зона коллизии:</strong><br />
            Только по расстоянию<br />
            Радиус: {collisionConfig.bat.radius} px
          </div>
        </div>
      )}
      
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

          {/* Отладочная визуализация зоны коллизии */}
          {debugMode && (
            <>
              {/* Круг коллизии вокруг биты - позиционируется относительно игрового контейнера */}
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  width: '1920px',
                  height: '1080px',
                  pointerEvents: 'none',
                  zIndex: 100
                }}
              >
                {/* Круг коллизии - используем transform для точного позиционирования */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    transform: `translate(${debugBatPos.x - collisionConfig.bat.radius}px, ${debugBatPos.y - collisionConfig.bat.radius}px)`,
                    width: `${collisionConfig.bat.radius * 2}px`,
                    height: `${collisionConfig.bat.radius * 2}px`,
                    border: '3px solid rgba(0, 255, 0, 0.7)',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  }}
                />
                {/* Центр биты */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    transform: `translate(${debugBatPos.x - 5}px, ${debugBatPos.y - 5}px)`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#00ff00',
                    borderRadius: '50%',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Scene;
