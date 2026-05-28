// Утилиты для работы с координатами относительно игрового контейнера

const GAME_CONTAINER_WIDTH = 1920;
const GAME_CONTAINER_HEIGHT = 1080;

/**
 * Преобразует координаты из viewport в координаты относительно игрового контейнера
 * @param {number} viewportX - Координата X относительно viewport
 * @param {number} viewportY - Координата Y относительно viewport
 * @param {number} scale - Текущий масштаб игрового контейнера
 * @param {HTMLElement} gameContainer - Элемент игрового контейнера
 * @returns {{x: number, y: number}} Координаты относительно игрового контейнера
 */
export function viewportToGameCoordinates(viewportX, viewportY, scale, gameContainer) {
  if (!gameContainer) {
    return { x: viewportX, y: viewportY };
  }

  const rect = gameContainer.getBoundingClientRect();
  
  // Вычисляем позицию относительно центра контейнера
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Преобразуем с учётом масштаба
  const gameX = (viewportX - centerX) / scale + GAME_CONTAINER_WIDTH / 2;
  const gameY = (viewportY - centerY) / scale + GAME_CONTAINER_HEIGHT / 2;
  
  return { x: gameX, y: gameY };
}

/**
 * Преобразует координаты из игрового контейнера в viewport координаты
 * @param {number} gameX - Координата X относительно игрового контейнера
 * @param {number} gameY - Координата Y относительно игрового контейнера
 * @param {number} scale - Текущий масштаб игрового контейнера
 * @param {HTMLElement} gameContainer - Элемент игрового контейнера
 * @returns {{x: number, y: number}} Координаты относительно viewport
 */
export function gameToViewportCoordinates(gameX, gameY, scale, gameContainer) {
  if (!gameContainer) {
    return { x: gameX, y: gameY };
  }

  const rect = gameContainer.getBoundingClientRect();
  
  // Вычисляем центр контейнера
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Преобразуем с учётом масштаба
  const viewportX = (gameX - GAME_CONTAINER_WIDTH / 2) * scale + centerX;
  const viewportY = (gameY - GAME_CONTAINER_HEIGHT / 2) * scale + centerY;
  
  return { x: viewportX, y: viewportY };
}

/**
 * Вычисляет расстояние между двумя точками
 * @param {number} x1 - Координата X первой точки
 * @param {number} y1 - Координата Y первой точки
 * @param {number} x2 - Координата X второй точки
 * @param {number} y2 - Координата Y второй точки
 * @returns {number} Расстояние между точками
 */
export function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Проверяет коллизию между двумя кругами
 * @param {Object} circle1 - Первый круг {x, y, radius}
 * @param {Object} circle2 - Второй круг {x, y, radius}
 * @returns {boolean} True если есть коллизия
 */
export function checkCircleCollision(circle1, circle2) {
  const distance = calculateDistance(circle1.x, circle1.y, circle2.x, circle2.y);
  return distance < (circle1.radius + circle2.radius);
}

/**
 * Получает точную позицию элемента относительно игрового контейнера
 * @param {HTMLElement} element - Элемент
 * @param {number} scale - Текущий масштаб
 * @param {HTMLElement} gameContainer - Игровой контейнер
 * @returns {{x: number, y: number}} Позиция центра элемента
 */
export function getElementGamePosition(element, scale, gameContainer) {
  if (!element) {
    return { x: 0, y: 0 };
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return viewportToGameCoordinates(centerX, centerY, scale, gameContainer);
}

/**
 * Проверяет коллизию между прямоугольником (с вращением) и кругом
 * @param {Object} rect - Прямоугольник {x, y, width, height, angle (rad)}
 * @param {Object} circle - Круг {x, y, radius}
 * @returns {boolean} True если есть коллизия
 */
export function checkRotatedRectCircleCollision(rect, circle) {
  // Переводим координаты круга в локальную систему прямоугольника
  const cos = Math.cos(-rect.angle);
  const sin = Math.sin(-rect.angle);

  // Смещение круга относительно центра прямоугольника
  const dx = circle.x - rect.x;
  const dy = circle.y - rect.y;

  // Вращаем координаты круга в локальную систему прямоугольника
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  // Находим ближайшую точку на прямоугольнике к центру круга
  const closestX = Math.max(-rect.width / 2, Math.min(rect.width / 2, localX));
  const closestY = Math.max(-rect.height / 2, Math.min(rect.height / 2, localY));

  // Расстояние от ближайшей точки до центра круга
  const distanceX = localX - closestX;
  const distanceY = localY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Проверяем, меньше ли расстояние квадрата радиуса
  return distanceSquared < (circle.radius * circle.radius);
}

