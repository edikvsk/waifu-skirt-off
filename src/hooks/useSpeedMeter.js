import { useState, useEffect } from 'react';

export const useSpeedMeter = () => {
  const [speedValue, setSpeedValue] = useState(0);
  const [speedDirection, setSpeedDirection] = useState(1);
  const [speedPaused, setSpeedPaused] = useState(false);

  useEffect(() => {
    const animateSpeed = () => {
      if (speedPaused) return;
      
      setSpeedValue(prev => {
        const newValue = prev + speedDirection * 2;
        if (newValue >= 100) {
          setSpeedDirection(-1);
          return 100;
        }
        if (newValue <= 0) {
          setSpeedDirection(1);
          return 0;
        }
        return newValue;
      });
    };

    const interval = setInterval(animateSpeed, 30);
    return () => clearInterval(interval);
  }, [speedDirection, speedPaused]);

  return { speedValue, setSpeedPaused, speedPaused };
};
