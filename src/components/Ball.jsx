import React, { forwardRef } from 'react';

const Ball = forwardRef((props, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        position: 'absolute',
        top: '60%',
        left: '0',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #ffd93d, #ff9500)',
        boxShadow: '0 0 20px rgba(255, 217, 61, 0.6), inset -5px -5px 10px rgba(0,0,0,0.2)',
        zIndex: 3,
        opacity: 0,
        pointerEvents: 'none'
      }}
    />
  );
});

Ball.displayName = 'Ball';

export default Ball;
