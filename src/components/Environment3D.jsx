import React from 'react';

const Environment3D = ({ currentLevel }) => {
  const isJapaneseSchool = currentLevel === 1;
  const isLoveHotel = currentLevel === 2;
  const isLevel3 = currentLevel === 3;
  const isBeach = currentLevel === 4;

  return (
    <>
      {/* Фон японской школы - только для первого уровня */}
      {isJapaneseSchool && (
        <div className="school-background">
          {/* Задняя стена с окнами */}
          <div className="back-wall">
            <div className="window window-1"></div>
            <div className="window window-2"></div>
            <div className="window window-3"></div>
            <div className="window window-4"></div>
          </div>
          
          {/* Классная доска */}
          <div className="blackboard">
            <div className="blackboard-frame"></div>
            <div className="blackboard-surface"></div>
          </div>
          
          {/* Боковые стены */}
          <div className="side-wall left"></div>
          <div className="side-wall right"></div>
          
          {/* Потолок */}
          <div className="ceiling"></div>
        </div>
      )}

      {/* Фон Love Hotel - для второго уровня */}
      {isLoveHotel && (
        <div className="love-hotel-background">
          {/* Задняя стена с неоновой вывеской */}
          <div className="love-hotel-back-wall">
            {/* Неоновая вывеска Love Hotel */}
            <div className="love-hotel-sign">
              <div className="love-hotel-text">Love Hotel</div>
              <div className="love-hotel-glow"></div>
            </div>
            
            {/* Дверь справа от вывески */}
            <div className="hotel-door">
              <div className="hotel-door-frame"></div>
              <div className="hotel-door-panel"></div>
              <div className="hotel-door-handle"></div>
              <div className="hotel-door-window"></div>
            </div>
            
            {/* Окна с занавесками */}
            <div className="hotel-window hotel-window-1">
              <div className="hotel-curtain left"></div>
              <div className="hotel-curtain right"></div>
            </div>
            <div className="hotel-window hotel-window-2">
              <div className="hotel-curtain left"></div>
              <div className="hotel-curtain right"></div>
            </div>
            <div className="hotel-window hotel-window-3">
              <div className="hotel-curtain left"></div>
              <div className="hotel-curtain right"></div>
            </div>
            
            {/* Диван под центральным окном */}
            <div className="hotel-sofa">
              <div className="sofa-back"></div>
              <div className="sofa-seat"></div>
              <div className="sofa-arm left"></div>
              <div className="sofa-arm right"></div>
            </div>
          </div>
          
          {/* Боковые стены с неоновыми полосами */}
          <div className="love-hotel-side-wall left"></div>
          <div className="love-hotel-side-wall right"></div>
          
          {/* Потолок с неоновым освещением */}
          <div className="love-hotel-ceiling"></div>
        </div>
      )}

      {/* Фон особняка - для третьего уровня */}
      {isLevel3 && (
        <div className="mansion-background">
          {/* Задняя стена с камином */}
          <div className="mansion-back-wall">
            {/* Камин */}
            <div className="mansion-fireplace">
              <div className="fireplace-frame"></div>
              <div className="fireplace-opening">
                <div className="fireplace-fire">
                  <div className="flame flame-1"></div>
                  <div className="flame flame-2"></div>
                  <div className="flame flame-3"></div>
                </div>
              </div>
              <div className="fireplace-mantel"></div>
            </div>

            {/* Картина над камином */}
            <div className="mansion-painting">
              <div className="painting-frame"></div>
              <div className="painting-canvas"></div>
            </div>

            {/* Окна с тяжёлыми шторами */}
            <div className="mansion-window mansion-window-1">
              <div className="mansion-curtain left"></div>
              <div className="mansion-curtain right"></div>
              <div className="mansion-curtain-tie left"></div>
              <div className="mansion-curtain-tie right"></div>
            </div>
            <div className="mansion-window mansion-window-2">
              <div className="mansion-curtain left"></div>
              <div className="mansion-curtain right"></div>
              <div className="mansion-curtain-tie left"></div>
              <div className="mansion-curtain-tie right"></div>
            </div>

            {/* Люстра */}
            <div className="mansion-chandelier">
              <div className="chandelier-chain"></div>
              <div className="chandelier-body">
                <div className="chandelier-arm arm-1"></div>
                <div className="chandelier-arm arm-2"></div>
                <div className="chandelier-arm arm-3"></div>
                <div className="chandelier-arm arm-4"></div>
                <div className="chandelier-arm arm-5"></div>
                <div className="chandelier-arm arm-6"></div>
                {/* Висящие кристаллы */}
                <div className="chandelier-crystal c-1"></div>
                <div className="chandelier-crystal c-2"></div>
                <div className="chandelier-crystal c-3"></div>
                <div className="chandelier-crystal c-4"></div>
                <div className="chandelier-crystal c-5"></div>
                <div className="chandelier-crystal c-6"></div>
                <div className="chandelier-crystal c-7"></div>
                <div className="chandelier-crystal c-8"></div>
                <div className="chandelier-crystal c-9"></div>
                <div className="chandelier-crystal c-10"></div>
              </div>
              <div className="chandelier-glow"></div>
            </div>
          </div>

          {/* Боковые стены с деревянными панелями */}
          <div className="mansion-side-wall left">
            <div className="wall-panel panel-1"></div>
            <div className="wall-panel panel-2"></div>
            <div className="wall-panel panel-3"></div>
          </div>
          <div className="mansion-side-wall right">
            <div className="wall-panel panel-1"></div>
            <div className="wall-panel panel-2"></div>
            <div className="wall-panel panel-3"></div>
          </div>

          {/* Потолок с лепниной */}
          <div className="mansion-ceiling">
            <div className="ceiling-molding"></div>
          </div>
        </div>
      )}

      {/* Фон пляжа - для четвёртого уровня */}
      {isBeach && (
        <div className="beach-background">
          {/* Небо с градиентом */}
          <div className="beach-sky">
            {/* Солнце наполовину за горизонтом */}
            <div className="beach-sunset-sun">
              <div className="sunset-sun-body"></div>
              <div className="sunset-sun-glow"></div>
            </div>
          </div>

          {/* Море */}
          <div className="beach-sea">
            {/* Солнечная дорожка */}
            <div className="sun-reflection">
              <div className="reflection-ray ray-1"></div>
              <div className="reflection-ray ray-2"></div>
              <div className="reflection-ray ray-3"></div>
              <div className="reflection-ray ray-4"></div>
              <div className="reflection-ray ray-5"></div>
            </div>
            {/* Волны */}
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>

          {/* Пляж с песком */}
          <div className="beach-sand">
            {/* Песчаные дюны */}
            <div className="sand-dune dune-1"></div>
            <div className="sand-dune dune-2"></div>
          </div>
        </div>
      )}

      {/* 3D пол - стиль зависит от уровня */}
      <div className={`floor-3d ${isJapaneseSchool ? 'floor-school' : isLoveHotel ? 'floor-love-hotel' : isLevel3 ? 'floor-mansion' : isBeach ? 'floor-beach' : 'floor-default'}`}>
        <div className={`floor-grid ${isJapaneseSchool ? 'grid-school' : isLoveHotel ? 'grid-love-hotel' : isLevel3 ? 'grid-mansion' : isBeach ? 'grid-beach' : 'grid-default'}`}></div>
      </div>
    </>
  );
};

export default Environment3D;
