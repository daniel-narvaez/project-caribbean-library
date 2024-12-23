import React, { useRef, useEffect } from 'react';
import { useChapters } from '../../contexts/Chapters';

export const Chapter = ({ children, ...props }) => {
  const ref = useRef(null);
  const { registerChapter, unregisterChapter } = useChapters();

  useEffect(() => {
    if (ref.current) {
      registerChapter(ref.current);
    }
    return () => {
      if (ref.current) {
        unregisterChapter(ref.current);
      }
    };
  }, [registerChapter, unregisterChapter]);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
};