import React, { useState, useEffect, useRef } from 'react';

const Countdown = ({ isActive, onComplete }) => {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      setCount(3);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setIsVisible(true);
    setCount(3);

    const runCountdown = () => {
      setCount(3);
      
      const tick = (currentCount) => {
        if (currentCount <= 0) {
          setIsVisible(false);
          onCompleteRef.current();
          return;
        }
        
        timerRef.current = setTimeout(() => {
          setCount(currentCount - 1);
          tick(currentCount - 1);
        }, 1000);
      };
      
      tick(3);
    };

    runCountdown();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  if (!isVisible || count === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000,
      pointerEvents: 'none'
    }}>
      <div style={{
        fontFamily: 'PakenhamBl Italic, serif',
        fontSize: '200px',
        fontWeight: 'bold',
        color: '#ffffff',
        WebkitTextStroke: '3px black',
        textStroke: '3px black',
        animation: 'countdownPulse 0.5s ease-in-out'
      }}>
        {count}
      </div>
    </div>
  );
};

export default Countdown;
