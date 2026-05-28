import { collisionConfig } from '../config/collisionConfig';

/**
 * Определяет уровень ветра для анимации юбки на основе скорости шара
 * @param {number} speedValue - Значение скорости от 0 до 100
 * @returns {number} - Уровень ветра (1, 2 или 3)
 */
export const getWindLevelFromSpeed = (speedValue) => {
  const { speedLevels } = collisionConfig;
  
  if (speedValue >= speedLevels.high.min && speedValue <= speedLevels.high.max) {
    return speedLevels.high.windLevel; // Высокая скорость - ветер3
  } else if (speedValue >= speedLevels.normal.min && speedValue <= speedLevels.normal.max) {
    return speedLevels.normal.windLevel; // Обычная скорость - ветер2
  } else {
    return speedLevels.low.windLevel; // Низкая скорость - ветер1
  }
};

export default getWindLevelFromSpeed;
