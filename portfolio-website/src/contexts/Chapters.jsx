// Chapters.jsx
import React, { createContext, useContext, useRef, useCallback } from 'react';

const ChaptersContext = createContext();

export const ChaptersProvider = ({ children }) => {
  const chaptersRef = useRef([]);

  const registerChapter = useCallback((ref) => {
    if (ref && !chaptersRef.current.includes(ref)) {
      chaptersRef.current.push(ref);
      // Sort chapters by their vertical position
      chaptersRef.current.sort((a, b) => 
        a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );
    }
  }, []);

  const unregisterChapter = useCallback((ref) => {
    chaptersRef.current = chaptersRef.current.filter(chapter => chapter !== ref);
  }, []);

  const getNextChapter = useCallback((currentPosition) => {
    console.log('All chapters:', chaptersRef.current);
    const next = chaptersRef.current.find(chapter =>
      chapter.getBoundingClientRect().top + window.scrollY > currentPosition
    );
    console.log('Found next chapter:', next);
    return next;
  }, []);

  return (
    <ChaptersContext.Provider value={{ registerChapter, unregisterChapter, getNextChapter }}>
      {children}
    </ChaptersContext.Provider>
  );
};

export const useChapters = () => {
  const context = useContext(ChaptersContext);
  if (!context) {
    throw new Error('useChapters must be used within a SectionsProvider');
  }
  return context;
};