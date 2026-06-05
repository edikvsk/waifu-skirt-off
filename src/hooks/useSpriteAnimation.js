import { useState, useEffect, useRef, useCallback } from 'react';
import { getAnimationConfig, generateFramePaths } from '../config/animationConfig';

export const useSpriteAnimation = (level, animationName = 'walk', trigger = 'ball', isTriggered = false) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frames, setFrames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef(null);
  const loadedImagesRef = useRef(0);
  const totalFramesRef = useRef(0);

  // Загрузка кадров анимации
  useEffect(() => {
    const config = getAnimationConfig(level, animationName);
    if (!config) return;

    const framePaths = generateFramePaths(config);
    setFrames(framePaths);
    totalFramesRef.current = framePaths.length;
    loadedImagesRef.current = 0;

    // Предзагрузка всех кадров
    framePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedImagesRef.current++;
        if (loadedImagesRef.current === totalFramesRef.current) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Ошибка загрузки кадра: ${path}`);
        loadedImagesRef.current++;
        if (loadedImagesRef.current === totalFramesRef.current) {
          setIsLoaded(true);
        }
      };
    });
  }, [level, animationName]);

  // Запуск анимации при триггере
  useEffect(() => {
    const config = getAnimationConfig(level, animationName);
    if (!config || !isLoaded) return;

    // Проверяем тип триггера
    if (config.trigger === trigger && isTriggered && !isPlaying) {
      setIsPlaying(true);
    } else if (!isTriggered && isPlaying) {
      setIsPlaying(false);
    }
  }, [isTriggered, trigger, level, animationName, isLoaded, isPlaying]);

  // Циклическая смена кадров
  useEffect(() => {
    if (!isPlaying || frames.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const config = getAnimationConfig(level, animationName);
    const frameRate = config?.frameRate || 12;
    const intervalMs = 1000 / frameRate;

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + 1;
        return nextFrame >= frames.length ? (config?.loop ? 0 : frames.length - 1) : nextFrame;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, frames, level, animationName]);

  // Сброс кадра при остановке
  useEffect(() => {
    if (!isPlaying) {
      setCurrentFrame(0);
    }
  }, [isPlaying]);

  // Функция для ручного запуска/остановки
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
  }, []);

  return {
    currentFrame,
    isPlaying,
    isLoaded,
    frames,
    play,
    pause,
    reset
  };
};
