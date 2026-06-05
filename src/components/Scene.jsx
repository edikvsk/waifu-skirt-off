import React, { useEffect, useState, useRef } from 'react';
import { useSceneRotation } from '../hooks/useSceneRotation';
import { useSpeedMeter } from '../hooks/useSpeedMeter';
import { useBallAnimation } from '../hooks/useBallAnimation';
import { useItemAnimation } from '../hooks/useItemAnimation';
import UIControls from './ui/UIControls';
import Countdown from './ui/Countdown';
import StarsRating from './ui/StarsRating';
import HitEffect from './ui/HitEffect';
import PlayerHitEffect from './ui/PlayerHitEffect';
import WindEffect from './ui/WindEffect';
import ResultsModal from './ui/ResultsModal';
import TrafficLight from './ui/TrafficLight';
import Environment3D from './Environment3D';
import Character from './Character';
import Ball from './Ball';
import Item from './Item';
import BaseballPlayer from './BaseballPlayer';
import { collisionConfig } from '../config/collisionConfig';
import { getElementGamePosition, calculateDistance, checkRotatedRectCircleCollision } from '../utils/coordinateUtils';
import { getWindLevelFromSpeed } from '../utils/speedUtils';

const Scene = ({ onBackToMenu, onLevelComplete, currentLevel }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windLevel, setWindLevel] = useState(1);
  const [scale, setScale] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [debugBatPos, setDebugBatPos] = useState({ x: 0, y: 0 });
  const [debugBallPos, setDebugBallPos] = useState({ x: 0, y: 0 });
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [fixedSpeedValue, setFixedSpeedValue] = useState(null);
  const [starsCount, setStarsCount] = useState(null);
  const [visibleStarsCount, setVisibleStarsCount] = useState(0);
  const [hitEffectActive, setHitEffectActive] = useState(false);
  const [hitPosition, setHitPosition] = useState(null);
  const [windEffectActive, setWindEffectActive] = useState(false);
  const [currentBallNumber, setCurrentBallNumber] = useState(1);
  const [totalBallsLaunched, setTotalBallsLaunched] = useState(0);
  const [isBallSequenceActive, setIsBallSequenceActive] = useState(false);
  const [ballResults, setBallResults] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [sequenceCompleted, setSequenceCompleted] = useState(false);
  const [trafficLightColor, setTrafficLightColor] = useState(null);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [speedLevel, setSpeedLevel] = useState('low');
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [hasEvaded, setHasEvaded] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [defeatTriggered, setDefeatTriggered] = useState(false);
  const [playerHitEffectActive, setPlayerHitEffectActive] = useState(false);
  const [playerHitPosition, setPlayerHitPosition] = useState(null);
  const [collisionProcessed, setCollisionProcessed] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  // Параметры невидимой биты (для отладки)
  const [batLength, setBatLength] = useState(collisionConfig.batVisual.length);
  const [batWidth, setBatWidth] = useState(collisionConfig.batVisual.width);
  const [batTop, setBatTop] = useState(collisionConfig.batVisual.top);
  const [batLeft, setBatLeft] = useState(collisionConfig.batVisual.left);
  const [batInitialAngle, setBatInitialAngle] = useState(collisionConfig.batVisual.initialAngle);
  const [batSwingAngle, setBatSwingAngle] = useState(collisionConfig.batVisual.swingAngle);
  const [savedConfig, setSavedConfig] = useState('');

  // Параметры анимации (для отладки)
  const [animScale, setAnimScale] = useState(1);
  const [animPosX, setAnimPosX] = useState(0);
  const [animPosY, setAnimPosY] = useState(0);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  
  // Custom hooks
  const { rotation, containerRef } = useSceneRotation(isBallSequenceActive);
  const { speedValue, setSpeedPaused, speedPaused } = useSpeedMeter();
  const { ballRef, ballAnimating, animateBall, reverseBall, ballPosition } = useBallAnimation(fixedSpeedValue !== null ? fixedSpeedValue : speedValue, setSpeedPaused, currentLevel);
  const { itemRef, itemAnimating, animateItem, reverseItem, pauseItem, itemPosition } = useItemAnimation(fixedSpeedValue !== null ? fixedSpeedValue : speedValue, setSpeedPaused, currentLevel);
  const [isItemLaunch, setIsItemLaunch] = useState(false);
  
  // Ref for baseball player swing function
  const baseballPlayerRef = useRef(null);
  const isSwingingRef = useRef(false);
  const gameContainerRef = useRef(null);
  
  // Refs для стабильных функций в useEffect
  const animateBallRef = useRef(null);
  const setSpeedPausedRef = useRef(null);
  const nextBallTimerRef = useRef(null);
  const speedValueRef = useRef(speedValue);
  const isLaunchingNextBallRef = useRef(false);
  
  // Обновляем refs когда значения меняются
  animateBallRef.current = animateBall;
  setSpeedPausedRef.current = setSpeedPaused;
  speedValueRef.current = speedValue;

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

  // Обработчик правой кнопки мыши для уклона
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
      handleEvasion();
    };

    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
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

  const startBallWithCountdown = () => {
    if (isBallSequenceActive || gamePaused) return;
    setIsBallSequenceActive(true);
    setSequenceCompleted(false);
    setCurrentBallNumber(1);
    setTotalBallsLaunched(0);
    setBallResults([]); // Сбрасываем результаты перед новой последовательностью

    // Для уровня 1 сначала запускаем анимацию, потом countdown
    if (currentLevel === 1) {
      // Анимация запустится автоматически через isBallSequenceActive
      // После окончания анимации (onAnimationPlayingChange(false)) запустим countdown
    } else {
      // Для остальных уровней - обычная логика
      // Запускаем светофор перед первым броском
      setTrafficLightColor('red');

      // Жёлтый через 1 секунду
      setTimeout(() => {
        setTrafficLightColor('yellow');
      }, 1000);

      // Синий через 2 секунды
      setTimeout(() => {
        setTrafficLightColor('blue');
      }, 2000);

      // Первый шар с обратным отсчётом
      setFixedSpeedValue(speedValue);
      setSpeedPaused(true);
      setIsCountdownActive(true);
    }
  };

  const handleCountdownComplete = () => {
    setIsCountdownActive(false);
    setHasEvaded(false);
    setDefeatTriggered(false);
    setCollisionProcessed(false);
    // 25% шанс запуска предмета
    const shouldLaunchItem = Math.random() < 0.25;
    setIsItemLaunch(shouldLaunchItem);
    if (shouldLaunchItem) {
      animateItem();
    } else {
      animateBall();
    }
    setTotalBallsLaunched(1);
  };

  // Запуск countdown после окончания анимации для уровня 1
  useEffect(() => {
    if (currentLevel === 1 && isBallSequenceActive && !isAnimationPlaying && totalBallsLaunched === 0) {
      // Анимация закончилась, запускаем светофор и countdown
      setTrafficLightColor('red');

      // Жёлтый через 1 секунду
      setTimeout(() => {
        setTrafficLightColor('yellow');
      }, 1000);

      // Синий через 2 секунды
      setTimeout(() => {
        setTrafficLightColor('blue');
      }, 2000);

      // Первый шар с обратным отсчётом
      setFixedSpeedValue(speedValue);
      setSpeedPaused(true);
      setIsCountdownActive(true);
    }
  }, [isAnimationPlaying, isBallSequenceActive, currentLevel, totalBallsLaunched, speedValue]);

  // Запуск следующего шара после завершения анимации
  useEffect(() => {
    // Очищаем предыдущий таймер если есть
    if (nextBallTimerRef.current) {
      clearTimeout(nextBallTimerRef.current);
      nextBallTimerRef.current = null;
    }

    const isAnimating = ballAnimating || itemAnimating;

    if (!isAnimating && isBallSequenceActive && totalBallsLaunched > 0 && totalBallsLaunched < 10 && !isLaunchingNextBallRef.current && animationsComplete && !gamePaused && !isAnimationPlaying) {
      console.log(`Запуск объекта ${totalBallsLaunched + 1}`);
      isLaunchingNextBallRef.current = true;

      // Гасим синий перед новым циклом
      setTrafficLightColor(null);

      // Красный через 0.2 сек
      const redTimer = setTimeout(() => {
        setTrafficLightColor('red');
      }, 200);

      // Жёлтый через 1.2 секунды
      const yellowTimer = setTimeout(() => {
        setTrafficLightColor('yellow');
      }, 1200);

      // Синий через 2.2 секунды
      const blueTimer = setTimeout(() => {
        setTrafficLightColor('blue');
      }, 2200);

      // Запуск объекта через 3.2 секунды (синий продолжает гореть)
      nextBallTimerRef.current = setTimeout(() => {
        setCurrentBallNumber(totalBallsLaunched + 1);
        setFixedSpeedValue(speedValueRef.current);
        setSpeedPausedRef.current(true);
        setHasEvaded(false);
        setDefeatTriggered(false);
        setCollisionProcessed(false);
        // 25% шанс запуска предмета
        const shouldLaunchItem = Math.random() < 0.25;
        setIsItemLaunch(shouldLaunchItem);
        if (shouldLaunchItem) {
          animateItem();
        } else {
          animateBallRef.current();
        }
        setTotalBallsLaunched(prev => prev + 1);
        nextBallTimerRef.current = null;
        isLaunchingNextBallRef.current = false;
        clearTimeout(redTimer);
        clearTimeout(yellowTimer);
        clearTimeout(blueTimer);
      }, 3200);
    } else if (!isAnimating && isBallSequenceActive && totalBallsLaunched >= 10) {
      console.log('Последовательность завершена');
      setTrafficLightColor(null);
      // Вычисляем максимальный результат
      const maxResult = ballResults.length > 0 ? Math.max(...ballResults) : 0;
      console.log('Результаты:', ballResults, 'Максимальный:', maxResult);

      // Сохраняем результат уровня
      onLevelComplete(currentLevel, maxResult);

      // Показываем модальное окно с задержкой 2 секунды
      setTimeout(() => {
        setShowResultsModal(true);
      }, 2000);

      // Последовательность завершена
      setIsBallSequenceActive(false);
      setSequenceCompleted(true);
      setCurrentBallNumber(1);
      setTotalBallsLaunched(0);
      isLaunchingNextBallRef.current = false;
    }

    return () => {
      if (nextBallTimerRef.current) {
        clearTimeout(nextBallTimerRef.current);
      }
    };
  }, [ballAnimating, itemAnimating, isBallSequenceActive, totalBallsLaunched, animationsComplete]);

  // Сбрасываем фиксированную скорость после завершения анимации шара
  useEffect(() => {
    if (!ballAnimating && fixedSpeedValue !== null) {
      setFixedSpeedValue(null);
    }
  }, [ballAnimating, fixedSpeedValue]);

  // Скрываем звёзды через 2 секунды после отображения
  useEffect(() => {
    if (starsCount !== null) {
      const timer = setTimeout(() => {
        setStarsCount(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [starsCount]);

  // Скрываем эффект удара через 0.4 секунды
  useEffect(() => {
    if (hitEffectActive) {
      const timer = setTimeout(() => {
        setHitEffectActive(false);
        setHitPosition(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [hitEffectActive]);

  // Скрываем эффект ветра через 1.2 секунды
  useEffect(() => {
    if (windEffectActive) {
      const timer = setTimeout(() => {
        setWindEffectActive(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [windEffectActive]);

  // Скрываем эффект удара предмета в бейсболиста через 0.6 секунды
  useEffect(() => {
    if (playerHitEffectActive) {
      const timer = setTimeout(() => {
        setPlayerHitEffectActive(false);
        setPlayerHitPosition(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [playerHitEffectActive]);

  // Последовательное появление звёзд после окончания ветра
  useEffect(() => {
    if (starsCount !== null && visibleStarsCount === 0 && !windEffectActive) {
      // Начинаем показывать звёзды после окончания ветра
      let currentVisible = 0;
      const showNextStar = () => {
        if (currentVisible < starsCount) {
          currentVisible++;
          setVisibleStarsCount(currentVisible);
          setTimeout(showNextStar, 600); // Интервал между звёздами 600мс
        }
      };
      showNextStar();
    }
  }, [starsCount, windEffectActive, visibleStarsCount]);

  // Отслеживаем завершение всех анимаций
  useEffect(() => {
    const allEffectsComplete = !hitEffectActive && !windEffectActive && starsCount === null;
    setAnimationsComplete(allEffectsComplete);
  }, [hitEffectActive, windEffectActive, starsCount]);

  const saveBatConfig = () => {
    const config = {
      batVisual: {
        length: batLength,
        width: batWidth,
        top: batTop,
        left: batLeft,
        initialAngle: batInitialAngle,
        swingAngle: batSwingAngle
      }
    };
    const json = JSON.stringify(config, null, 2);
    setSavedConfig(json);
    console.log('=== СОХРАНЁННЫЙ КОНФИГ БИТЫ ===');
    console.log(json);
  };

  const swingBat = () => {
    if (!isBallSequenceActive) return; // Не разрешаем удар когда кнопка BALL видна
    if (baseballPlayerRef.current && baseballPlayerRef.current.swingBat) {
      baseballPlayerRef.current.swingBat();
      isSwingingRef.current = true;

      // Проверка коллизии во время взмаха
      setTimeout(() => {
        isSwingingRef.current = false;
      }, collisionConfig.swing.totalDuration); // Длительность всего взмаха из конфигурации
    }
  };

  const handleEvasion = () => {
    if (baseballPlayerRef.current && baseballPlayerRef.current.evasion) {
      baseballPlayerRef.current.evasion();
      setHasEvaded(true);
      // Сбрасываем hasEvaded через 200ms (длительность уворота)
      setTimeout(() => {
        setHasEvaded(false);
      }, 200);
    }
  };

  const handleTestSkirtFall = () => {
    if (currentLevel === 4) {
      setSpeedLevel('high');
      setIsAnimating(true);
    }
  };

  const handleSkirtSequenceStart = () => {
    // Не ставим паузу игры, чтобы шары продолжали лететь
  };

  const handleSkirtSequenceEnd = () => {
    if (currentLevel === 4) {
      setSpeedLevel('low');
      // Не сбрасываем isAnimating, чтобы игра продолжилась
    }
  };

  const checkCollision = () => {
    if (!baseballPlayerRef.current || !ballAnimating || !isSwingingRef.current) return;

    const batPos = baseballPlayerRef.current.getBatPosition();
    const ballPos = ballPosition.current;

    // Прямоугольник биты с учётом вращения
    const batRect = {
      x: batPos.x,
      y: batPos.y,
      width: batWidth,
      height: batLength,
      angle: (batPos.angle * Math.PI) / 180 // конвертируем градусы в радианы
    };

    // Круг шара
    const ballCircle = {
      x: ballPos.x,
      y: ballPos.y,
      radius: collisionConfig.ball.radius
    };

    // Проверка коллизии прямоугольник-круг с учётом вращения
    const hasCollision = checkRotatedRectCircleCollision(batRect, ballCircle);

    if (hasCollision) {
      console.log('КОЛЛИЗИЯ! Шар отбит битой');

      // Активируем эффект удара
      setHitPosition({ x: ballPos.x, y: ballPos.y });
      setHitEffectActive(true);

      // Активируем эффект ветра с задержкой
      setTimeout(() => {
        setWindEffectActive(true);
      }, 1000);

      // Определяем уровень ветра на основе скорости шара
      const newWindLevel = getWindLevelFromSpeed(speedValue);
      setWindLevel(newWindLevel);
      setIsAnimating(true); // Включаем анимацию юбки

      // Определяем уровень скорости для спрайта девушки
      const { speedLevels } = collisionConfig;
      let newSpeedLevel = 'low';
      let newStarsCount = 0;
      if (speedValue >= speedLevels.high.min && speedValue <= speedLevels.high.max) {
        newSpeedLevel = 'high';
        newStarsCount = 3; // Высокая скорость - 3 звезды
      } else if (speedValue >= speedLevels.normal.min && speedValue <= speedLevels.normal.max) {
        newSpeedLevel = 'normal';
        newStarsCount = 2; // Обычная скорость - 2 звезды
      } else {
        newSpeedLevel = 'low';
        newStarsCount = 1; // Низкая скорость - 1 звезда
      }
      setSpeedLevel(newSpeedLevel);
      setStarsCount(newStarsCount);
      setVisibleStarsCount(0); // Сбрасываем видимые звёзды
      setAnimationTrigger(prev => prev + 1); // Триггер для перезапуска анимации

      // Сохраняем результат для текущего шара
      setBallResults(prev => [...prev, newStarsCount]);

      console.log(`Скорость шара: ${speedValue}, Уровень ветра: ${newWindLevel}, Звёзды: ${newStarsCount}`);

      reverseBall();
      isSwingingRef.current = false; // Предотвращаем множественные отскоки
    }
  };

  const checkItemCollision = () => {
    if (!baseballPlayerRef.current || !itemAnimating || defeatTriggered || collisionProcessed) return;

    const itemPos = itemPosition.current;
    const playerPos = baseballPlayerRef.current.getPlayerPosition();

    // Проверяем коллизию предмета с бейсболистом (по центру предмета)
    const distance = Math.sqrt(
      Math.pow(itemPos.x - playerPos.x, 2) +
      Math.pow(itemPos.y - playerPos.y, 2)
    );

    // Радиус коллизии для предмета (уменьшен для более точного срабатывания)
    const collisionRadius = 250;

    console.log('Проверка коллизии предмета - Distance:', distance, 'Radius:', collisionRadius, 'itemX:', itemPos.x, 'playerX:', playerPos.x, 'itemY:', itemPos.y, 'playerY:', playerPos.y);

    if (distance < collisionRadius) {
      console.log('ПРЕДМЕТ ВРЕЗАЛСЯ В БЕЙСБОЛИСТА! Distance:', distance, 'hasEvaded:', hasEvaded);

      setDefeatTriggered(true);
      setCollisionProcessed(true);

      if (!hasEvaded) {
        // Если не было уворота - поражение
        console.log('НЕ БЫЛО УВОРОТА - ПОРАЖЕНИЕ');
        
        // Останавливаем объект на месте при столкновении
        pauseItem();
        
        // Показываем спрайт поражения бейсболиста
        if (baseballPlayerRef.current && baseballPlayerRef.current.hitByItem) {
          baseballPlayerRef.current.hitByItem();
        }
        
        // Показываем эффект удара предмета в бейсболиста
        setPlayerHitPosition({ x: playerPos.x, y: playerPos.y });
        setPlayerHitEffectActive(true);
        
        // Задерживаем показ модального окна поражения на 600мс
        setTimeout(() => {
          setShowDefeatModal(true);
          setIsBallSequenceActive(false);
        }, 600);
      } else {
        // Если был уворот - предмет просто улетает
        console.log('БЫЛ УВОРОТ - предмет пролетел');
      }
    }
  };

  // Непрерывная проверка коллизии во время полета шара
  useEffect(() => {
    if (!ballAnimating) return;

    const checkInterval = setInterval(checkCollision, 16); // ~60fps

    return () => clearInterval(checkInterval);
  }, [ballAnimating]);

  // Непрерывная проверка коллизии предмета во время полёта
  useEffect(() => {
    if (!itemAnimating || collisionProcessed) return;

    const checkInterval = setInterval(checkItemCollision, 16); // ~60fps

    return () => clearInterval(checkInterval);
  }, [itemAnimating, hasEvaded, collisionProcessed]);

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
      {/* Светофор между бросками */}
      {!isCountdownActive && !ballAnimating && !isBallSequenceActive && !sequenceCompleted ? null : <TrafficLight activeColor={trafficLightColor || 'off'} />}

      {/* UI слой - кнопки и шкала скорости */}
      <UIControls
        windLevel={windLevel}
        isAnimating={isAnimating}
        ballAnimating={ballAnimating}
        isCountdownActive={isCountdownActive}
        currentBallNumber={currentBallNumber}
        isBallSequenceActive={isBallSequenceActive}
        sequenceCompleted={sequenceCompleted}
        speedValue={speedValue}
        onWindLevelChange={setWindLevelAndAnimate}
        onAnimateBall={startBallWithCountdown}
        onEvasion={handleEvasion}
        onTestSkirtFall={currentLevel === 4 ? handleTestSkirtFall : null}
      />

      {/* Обратный отсчёт */}
      <Countdown
        isActive={isCountdownActive}
        onComplete={handleCountdownComplete}
      />

      {/* Рейтинг звёзд */}
      <StarsRating filledCount={starsCount} visibleCount={visibleStarsCount} />

      {/* Эффект удара */}
      <HitEffect isActive={hitEffectActive} position={hitPosition} />

      {/* Эффект удара предмета в бейсболиста */}
      <PlayerHitEffect isActive={playerHitEffectActive} position={playerHitPosition} />

      {/* Эффект ветра */}
      <WindEffect isActive={windEffectActive} windLevel={windLevel} />

      {/* Модальное окно с результатами */}
      {showResultsModal && (
        <ResultsModal
          maxStars={ballResults.length > 0 ? Math.max(...ballResults) : 0}
          onClose={() => {
            setShowResultsModal(false);
            onBackToMenu();
          }}
        />
      )}

      {/* Модальное окно поражения */}
      {showDefeatModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}
          onClick={() => {
            setShowDefeatModal(false);
            onBackToMenu();
          }}
        >
          <div
            style={{
              background: 'rgba(30, 30, 30, 0.95)',
              padding: '60px 80px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 0 50px rgba(255, 0, 0, 0.5)',
              border: '2px solid rgba(255, 0, 0, 0.3)'
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ff4444',
                marginBottom: '20px',
                fontFamily: 'PakenhamBl Italic, cursive'
              }}
            >
              ПОРАЖЕНИЕ
            </div>
          </div>
        </div>
      )}

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
          <div style={{ marginBottom: '10px' }}>
            <strong>Зона коллизии:</strong><br />
            Только по расстоянию<br />
            Радиус: {collisionConfig.bat.radius} px
          </div>

          {/* Ползунки настройки биты */}
          <div style={{ borderTop: '1px solid #00ff00', paddingTop: '10px', marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '13px' }}>
              ⚾ НАСТРОЙКА БИТЫ
            </div>

            {/* Длина */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Длина: {batLength}px
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={batLength}
              onChange={(e) => setBatLength(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            {/* Ширина */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Ширина: {batWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={batWidth}
              onChange={(e) => setBatWidth(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            {/* Позиция Y (top) */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Y (top): {batTop}px
            </label>
            <input
              type="range"
              min="0"
              max="1200"
              value={batTop}
              onChange={(e) => setBatTop(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            {/* Позиция X (left) */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              X (left): {batLeft}px
            </label>
            <input
              type="range"
              min="0"
              max="1200"
              value={batLeft}
              onChange={(e) => setBatLeft(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            {/* Начальный угол */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Нач. угол: {batInitialAngle}°
            </label>
            <input
              type="range"
              min="-360"
              max="360"
              value={batInitialAngle}
              onChange={(e) => setBatInitialAngle(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            {/* Угол момента удара */}
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Угол удара: {batSwingAngle}°
            </label>
            <input
              type="range"
              min="-360"
              max="360"
              value={batSwingAngle}
              onChange={(e) => setBatSwingAngle(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <button
              onClick={saveBatConfig}
              style={{
                width: '100%',
                padding: '8px',
                background: '#00aa00',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
            >
              💾 Сохранить конфиг
            </button>

            {savedConfig && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Конфиг для меня:</div>
                <textarea
                  readOnly
                  value={savedConfig}
                  style={{
                    width: '100%',
                    height: '120px',
                    background: '#111',
                    color: '#0f0',
                    border: '1px solid #0f0',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    padding: '6px',
                    resize: 'none'
                  }}
                />
              </div>
            )}

            {/* Ползунки настройки анимации */}
            <div style={{ borderTop: '1px solid #00ff00', paddingTop: '10px', marginBottom: '10px' }}>
              <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '13px' }}>
                🎬 НАСТРОЙКА АНИМАЦИИ
              </div>

              {/* Scale */}
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Scale: {animScale.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.01"
                value={animScale}
                onChange={(e) => setAnimScale(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '10px' }}
              />

              {/* Position X */}
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Pos X: {animPosX}px
              </label>
              <input
                type="range"
                min="-1000"
                max="200"
                value={animPosX}
                onChange={(e) => setAnimPosX(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '10px' }}
              />

              {/* Position Y */}
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Pos Y: {animPosY}px
              </label>
              <input
                type="range"
                min="-200"
                max="200"
                value={animPosY}
                onChange={(e) => setAnimPosY(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Игровой контейнер с фиксированным размером */}
      <div 
        ref={gameContainerRef}
        onClick={swingBat}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: '1920px',
          height: '1080px',
          transformOrigin: 'center center',
          overflow: 'hidden',
          willChange: 'transform',
          zIndex: 1,
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          cursor: 'pointer'
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
            height: '100%',
            willChange: 'transform',
            transformStyle: 'preserve-3d',
            transformOrigin: '400px 555px'
          }}
        >
          {/* 3D окружение (пол) */}
          <Environment3D currentLevel={currentLevel} />
          
          {/* Персонаж с дочерними элементами */}
          <Character
            imageLoaded={imageLoaded}
            isAnimating={isAnimating}
            windLevel={windLevel}
            sceneRotation={rotation}
            speedLevel={speedLevel}
            currentLevel={currentLevel}
            animationTrigger={animationTrigger}
            onSkirtSequenceStart={handleSkirtSequenceStart}
            onSkirtSequenceEnd={handleSkirtSequenceEnd}
            isBallSequenceActive={isBallSequenceActive}
            sequenceCompleted={sequenceCompleted}
            animScale={animScale}
            animPosX={animPosX}
            animPosY={animPosY}
            onAnimationPlayingChange={setIsAnimationPlaying}
          >
            <Ball ref={ballRef} />
            <Item ref={itemRef} currentLevel={currentLevel} />
          </Character>
          
          {/* Бейсболист справа */}
          <BaseballPlayer
            ref={baseballPlayerRef}
            sceneRotation={rotation}
            debugMode={debugMode}
            batLength={batLength}
            batWidth={batWidth}
            batTop={batTop}
            batLeft={batLeft}
            batInitialAngle={batInitialAngle}
            batSwingAngle={batSwingAngle}
            currentLevel={currentLevel}
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
