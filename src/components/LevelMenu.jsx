import React from 'react';

function LevelMenu({ onLevelSelect, onBack, levelResults, totalStars }) {
  // Вычисляем разблокировку уровней на основе звёзд
  const levels = [
    { id: 1, requiredStars: 0 },
    { id: 2, requiredStars: 2 },
    { id: 3, requiredStars: 4 },
    { id: 4, requiredStars: 6 },
    { id: 5, requiredStars: 8 },
    { id: 6, requiredStars: 10 },
    { id: 7, requiredStars: 12 },
    { id: 8, requiredStars: 14 },
    { id: 9, requiredStars: 16 },
  ].map(level => ({
    ...level,
    unlocked: totalStars >= level.requiredStars
  }));

  return (
    <div className="level-menu">
      {/* Общее количество звёзд слева вверху */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '28px',
        color: '#fff',
        fontWeight: 'bold',
        textShadow: '0 0 15px rgba(255, 217, 61, 0.8)',
        fontFamily: 'PakenhamBl Italic, cursive'
      }}>
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>

      <h2 className="level-menu-title">ВЫБЕРИ УРОВЕНЬ</h2>
      <div className="levels-grid">
        {levels.map((level) => (
          <button
            key={level.id}
            className={`level-button ${level.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => level.unlocked && onLevelSelect(level.id)}
            disabled={!level.unlocked}
            style={{
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
              {level.id}
            </div>
            {levelResults[level.id] && (
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px'
              }}>
                {[1, 2, 3].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: '28px',
                      filter: star <= levelResults[level.id] ? 'none' : 'grayscale(100%) opacity(0.3)',
                      textShadow: star <= levelResults[level.id] 
                        ? '0 0 8px rgba(255, 217, 61, 0.8), 0 0 16px rgba(255, 217, 61, 0.6), 0 0 24px rgba(255, 217, 61, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.3)'
                        : 'none',
                      lineHeight: 1
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      <button className="back-button" onClick={onBack}>
        Назад
      </button>
    </div>
  );
}

export default LevelMenu;
