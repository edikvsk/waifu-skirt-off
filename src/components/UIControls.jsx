import React from 'react';

const UIControls = ({
  windLevel,
  isAnimating,
  ballAnimating,
  speedValue,
  onWindLevelChange,
  onToggleAnimation,
  onAnimateBall,
  onSwingBat
}) => {
  return (
    <>
      {/* Шкала скорости слева */}
      <div style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '30px',
        height: '300px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '15px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        zIndex: 1000
      }}>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: `${speedValue}%`,
          background: `linear-gradient(to top, #ff6b6b, #ffd93d, #4ecdc4)`,
          transition: 'height 0.03s linear',
          borderRadius: '0 0 13px 13px'
        }} />
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          {Math.round(speedValue)}%
        </div>
      </div>
      
      {/* Кнопки управления */}
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
        <button 
          onClick={onToggleAnimation}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: isAnimating ? '#ff6b6b' : '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {isAnimating ? 'Стоп' : 'Старт'}
        </button>
        <button 
          onClick={onAnimateBall}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: ballAnimating ? '#ff6b6b' : '#ffd93d',
            color: '#333',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Шар
        </button>
        <button 
          onClick={onSwingBat}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Бита
        </button>
      </div>
    </>
  );
};

export default UIControls;
