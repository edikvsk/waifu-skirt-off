import React from 'react';

const TrafficLight = ({ activeColor }) => {
  const isOff = activeColor === 'off' || !activeColor;
  
  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: '20px',
      display: 'flex',
      gap: '8px',
      padding: '8px 15px',
      background: 'rgba(30, 30, 40, 0.9)',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      border: '2px solid rgba(100, 100, 150, 0.3)',
      zIndex: 1000
    }}>
      {/* Красный свет */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: !isOff && activeColor === 'red' 
          ? 'radial-gradient(circle, #ff4444 0%, #cc0000 100%)' 
          : 'rgba(50, 50, 50, 0.8)',
        boxShadow: !isOff && activeColor === 'red' 
          ? '0 0 15px rgba(255, 68, 68, 0.8), 0 0 30px rgba(255, 68, 68, 0.4)' 
          : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease'
      }} />
      
      {/* Жёлтый свет */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: !isOff && activeColor === 'yellow' 
          ? 'radial-gradient(circle, #ffcc00 0%, #ff9900 100%)' 
          : 'rgba(50, 50, 50, 0.8)',
        boxShadow: !isOff && activeColor === 'yellow' 
          ? '0 0 15px rgba(255, 204, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.4)' 
          : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease'
      }} />
      
      {/* Синий свет */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: !isOff && activeColor === 'blue' 
          ? 'radial-gradient(circle, #4488ff 0%, #0044cc 100%)' 
          : 'rgba(50, 50, 50, 0.8)',
        boxShadow: !isOff && activeColor === 'blue' 
          ? '0 0 15px rgba(68, 136, 255, 0.8), 0 0 30px rgba(68, 136, 255, 0.4)' 
          : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease'
      }} />
    </div>
  );
};

export default TrafficLight;
