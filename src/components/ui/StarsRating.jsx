import React from 'react';

const StarsRating = ({ filledCount }) => {
  if (filledCount === null || filledCount === 0) return null;

  const renderStar = (index) => {
    const isFilled = index < filledCount;
    return (
      <svg
        key={index}
        width="40"
        height="40"
        viewBox="0 0 24 24"
        style={{
          margin: '0 5px',
          filter: isFilled ? 'drop-shadow(0 0 8px rgba(255, 215, 61, 0.8))' : 'none'
        }}
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={isFilled ? '#FFD700' : 'none'}
          stroke={isFilled ? '#FFD700' : '#666'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: '15%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      animation: 'starsAppear 0.5s ease-out'
    }}>
      {[0, 1, 2].map(renderStar)}
    </div>
  );
};

export default StarsRating;
