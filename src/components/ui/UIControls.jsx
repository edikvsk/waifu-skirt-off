import React, { useState } from 'react';

const UIControls = ({
  windLevel,
  isAnimating,
  ballAnimating,
  isCountdownActive,
  currentBallNumber,
  isBallSequenceActive,
  sequenceCompleted,
  speedValue,
  onWindLevelChange,
  onAnimateBall,
  onEvasion,
  onTestSkirtFall
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleBallClick = () => {
    setIsClicked(true);
    onAnimateBall();
    setTimeout(() => setIsClicked(false), 300);
  };
  return (
    <>
      {/* Затемнённый и размытый фон когда кнопка BALL видна */}
      {!isCountdownActive && !ballAnimating && !isBallSequenceActive && !sequenceCompleted && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Отображение номера шара в левом верхнем углу */}
      {isBallSequenceActive && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            fontSize: '32px',
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(255, 217, 61, 0.8)',
            zIndex: 1000,
            fontFamily: 'PakenhamBl Italic, cursive'
          }}
        >
          BALL {currentBallNumber}/10
        </div>
      )}

      {/* Кнопка BALL по центру экрана */}
      {!isCountdownActive && !ballAnimating && !isBallSequenceActive && !sequenceCompleted && (
        <button 
          onClick={handleBallClick}
          className="anime-button"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) ${isClicked ? 'scale(0.9)' : 'scale(1)'}`,
            padding: '20px 60px',
            fontSize: '32px',
            backgroundColor: ballAnimating ? '#ff6b6b' : '#ffd93d',
            color: '#333',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: isClicked 
              ? '0 4px 20px rgba(255, 217, 61, 0.8), 0 0 50px rgba(255, 217, 61, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.4)'
              : '0 8px 30px rgba(0,0,0,0.4)',
            fontWeight: 'bold',
            transition: 'all 0.15s ease',
            zIndex: 1000,
            fontFamily: 'PakenhamBl Italic, cursive'
          }}
        >
          BALL
        </button>
      )}

      {/* Кнопки управления внизу */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={onEvasion}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
          Уворот
        </button>
        {onTestSkirtFall && (
          <button
            onClick={onTestSkirtFall}
            style={{
              padding: '12px 25px',
              fontSize: '16px',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#8e44ad'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#9b59b6'}
          >
            Тест юбки
          </button>
        )}
        <button
          onClick={() => onWindLevelChange(1)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 1 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 1
        </button>
        <button
          onClick={() => onWindLevelChange(2)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 2 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 2
        </button>
        <button
          onClick={() => onWindLevelChange(3)}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: windLevel === 3 ? '#4ecdc4' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Ветер 3
        </button>
      </div>
    </>
  );
};

export default UIControls;
