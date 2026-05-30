import { useState, useEffect, useRef } from 'react';

export const useSceneRotation = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Ограничиваем угол вращения (максимум ±7 градусов)
      const rotateY = ((mouseX - centerX) / centerX) * 7;
      const rotateX = ((mouseY - centerY) / centerY) * 5;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { rotation, containerRef };
};
