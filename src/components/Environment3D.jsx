import React from 'react';

const Environment3D = ({ currentLevel }) => {
  const isJapaneseSchool = currentLevel === 1;
  const isLoveHotel = currentLevel === 2;
  const isLevel3 = currentLevel === 3;

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

      {/* 3D пол - стиль зависит от уровня */}
      <div className={`floor-3d ${isJapaneseSchool ? 'floor-school' : isLoveHotel ? 'floor-love-hotel' : isLevel3 ? 'floor-love-hotel' : 'floor-default'}`}>
        <div className={`floor-grid ${isJapaneseSchool ? 'grid-school' : isLoveHotel ? 'grid-love-hotel' : isLevel3 ? 'grid-love-hotel' : 'grid-default'}`}></div>
      </div>
    </>
  );
};

export default Environment3D;
