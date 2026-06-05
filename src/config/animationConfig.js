// Конфигурация анимаций по уровням
export const animationConfig = {
  1: {
    // Анимация ходьбы для уровня 1
    walk: {
      path: '/anims/level1/walk',
      prefix: 'anim_girl_walk_lvl1_',
      suffix: '.webp',
      startFrame: 0,
      endFrame: 85,
      frameRate: 24, // кадров в секунду (увеличено для плавности)
      loop: true,
      trigger: 'ball' // триггер запуска: 'ball' - при нажатии BALL
    }
  },
  2: {
    // Анимации для уровня 2 (заполнить позже)
    walk: {
      path: '/anims/level2/walk',
      prefix: 'anim_girl_walk_lvl2_',
      suffix: '.webp',
      startFrame: 0,
      endFrame: 0, // будет заполнено
      frameRate: 12,
      loop: true,
      trigger: 'ball'
    }
  },
  3: {
    // Анимации для уровня 3 (заполнить позже)
    walk: {
      path: '/anims/level3/walk',
      prefix: 'anim_girl_walk_lvl3_',
      suffix: '.webp',
      startFrame: 0,
      endFrame: 0,
      frameRate: 12,
      loop: true,
      trigger: 'ball'
    }
  },
  4: {
    // Анимации для уровня 4 (заполнить позже)
    walk: {
      path: '/anims/level4/walk',
      prefix: 'anim_girl_walk_lvl4_',
      suffix: '.webp',
      startFrame: 0,
      endFrame: 0,
      frameRate: 12,
      loop: true,
      trigger: 'ball'
    }
  },
  5: {
    // Анимации для уровня 5 (заполнить позже)
    walk: {
      path: '/anims/level5/walk',
      prefix: 'anim_girl_walk_lvl5_',
      suffix: '.webp',
      startFrame: 0,
      endFrame: 0,
      frameRate: 12,
      loop: true,
      trigger: 'ball'
    }
  }
};

// Получить конфигурацию анимации для уровня
export const getAnimationConfig = (level, animationName = 'walk') => {
  const levelConfig = animationConfig[level];
  if (!levelConfig) return null;
  
  const animConfig = levelConfig[animationName];
  if (!animConfig) return null;
  
  return animConfig;
};

// Генерировать пути к кадрам анимации
export const generateFramePaths = (config) => {
  const frames = [];
  for (let i = config.startFrame; i <= config.endFrame; i++) {
    const frameNumber = i.toString().padStart(3, '0');
    frames.push(`${config.path}/${config.prefix}${frameNumber}${config.suffix}`);
  }
  return frames;
};
