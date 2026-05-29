import React from 'react';

const ResultsModal = ({ maxStars, onClose }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '60px 80px',
          borderRadius: '30px',
          textAlign: 'center',
          border: '3px solid rgba(255, 217, 61, 0.5)',
          boxShadow: '0 0 50px rgba(255, 217, 61, 0.3)',
          fontFamily: 'PakenhamBl Italic, cursive'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          style={{
            fontSize: '48px',
            color: '#fff',
            marginBottom: '30px',
            textShadow: '0 0 20px rgba(255, 217, 61, 0.8)'
          }}
        >
          РЕЗУЛЬТАТ
        </h2>
        
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              style={{
                fontSize: '64px',
                filter: star <= maxStars ? 'none' : 'grayscale(100%) opacity(0.3)',
                textShadow: star <= maxStars ? '0 0 30px rgba(255, 217, 61, 0.8)' : 'none'
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '15px 50px',
            fontSize: '24px',
            background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(255, 107, 157, 0.4)',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            fontFamily: 'PakenhamBl Italic, cursive'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 40px rgba(255, 107, 157, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 30px rgba(255, 107, 157, 0.4)';
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ResultsModal;
