import React from 'react';

const Environment3D = ({ currentLevel }) => {
  const isJapaneseSchool = currentLevel === 1;

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

      {/* 3D пол - стиль зависит от уровня */}
      <div className={`floor-3d ${isJapaneseSchool ? 'floor-school' : 'floor-default'}`}>
        <div className={`floor-grid ${isJapaneseSchool ? 'grid-school' : 'grid-default'}`}></div>
      </div>
    </>
  );
};

export default Environment3D;
