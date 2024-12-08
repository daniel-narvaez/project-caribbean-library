import React, { useState, useEffect } from 'react';
import styles from './Cursor.module.css';

export const SplashEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const [id, setId] = useState(0);

  const hasHrefInTree = (element) => {
    if (!element) return false;
    
    let current = element;
    while (current && current !== document.documentElement) {
      if (current.tagName === 'A' && current.hasAttribute('href')) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const hasHref = hasHrefInTree(e.target);
      setIsPointer(hasHref);
    };

    const handleMouseDown = (e) => {
      if (!hasHrefInTree(e.target)) return;
      setIsPressed(true);

      const newId = id + 1;
      setId(newId);

      setSplashes(prev => [...prev, {
        id: newId,
        x: e.clientX,
        y: e.clientY
      }]);

      setTimeout(() => {
        setSplashes(prev => prev.filter(splash => splash.id !== newId));
      }, 700);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver, true);
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver, true);
      window.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id]);

  return (
    <>
      {isPointer && (
        <div 
          className={`${styles.cursorDot} ${splashes.length ? styles.active : ''}`}
          style={{
            left: position.x,
            top: position.y
          }}
        />
      )}

      {splashes.map(splash => (
        <div
          key={splash.id}
          className={styles.splash}
          style={{
            left: splash.x,
            top: splash.y
          }}
        />
      ))}
    </>
  );
};