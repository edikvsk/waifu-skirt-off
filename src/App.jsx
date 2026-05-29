import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import MainMenu from './components/MainMenu';
import LevelMenu from './components/LevelMenu';

function App() {
  const [gameState, setGameState] = useState('main-menu'); // 'main-menu', 'level-menu', 'playing'
  const [levelResults, setLevelResults] = useState(() => {
    // Загружаем результаты из localStorage при инициализации
    const saved = localStorage.getItem('skirtOffLevelResults');
    return saved ? JSON.parse(saved) : {};
  }); // Хранение результатов по уровням: { levelId: stars }
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleStart = () => {
    setGameState('level-menu');
  };

  const handleLevelSelect = (levelId) => {
    setCurrentLevel(levelId);
    setGameState('playing');
  };

  const handleBack = () => {
    setGameState('main-menu');
  };

  const handleBackToLevelMenu = () => {
    setGameState('level-menu');
  };

  const handleLevelComplete = (levelId, stars) => {
    setLevelResults(prev => {
      const newResults = {
        ...prev,
        [levelId]: Math.max(prev[levelId] || 0, stars) // Сохраняем максимальный результат
      };
      // Сохраняем в localStorage
      localStorage.setItem('skirtOffLevelResults', JSON.stringify(newResults));
      return newResults;
    });
  };

  // Вычисляем общее количество звёзд
  const totalStars = Object.values(levelResults).reduce((sum, stars) => sum + stars, 0);

  return (
    <div className="app">
      {gameState === 'main-menu' && <MainMenu onStart={handleStart} />}
      {gameState === 'level-menu' && <LevelMenu onLevelSelect={handleLevelSelect} onBack={handleBack} levelResults={levelResults} totalStars={totalStars} />}
      {gameState === 'playing' && <Scene onBackToMenu={handleBackToLevelMenu} onLevelComplete={handleLevelComplete} currentLevel={currentLevel} />}
    </div>
  );
}

export default App;
