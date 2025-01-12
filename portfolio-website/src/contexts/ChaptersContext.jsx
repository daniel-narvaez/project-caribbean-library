/**
 * Chapters.jsx
 * ===========
 * 
 * Overview:
 * A context provider for managing chapter/section references and their positions
 * in the document. Provides utilities for registering, unregistering, and finding
 * chapters based on scroll position.
 * 
 * Key Features:
 * - Dynamic chapter registration system
 * - Automatic position-based sorting
 * - Next chapter detection based on scroll position
 * - Memoized utility functions
 * 
 * Technical Implementation:
 * - React Context API for state distribution
 * - useRef for mutable chapter references
 * - Memoized functions with useCallback
 * - Efficient DOM position calculations
 */

import React, { createContext, useContext, useRef, useCallback } from 'react';

const ChaptersContext = createContext();

/**
 * Provider component for managing chapter references and positions
 * @param {Object} props 
 * @param {React.ReactNode} props.children - Child components to be wrapped
 */
export const ChaptersProvider = ({ children }) => {
  // Store chapter refs in a mutable ref to prevent unnecessary rerenders
  const chaptersRef = useRef([]);

  /**
   * Registers a new chapter and sorts all chapters by vertical position
   * @param {HTMLElement} ref - DOM reference to the chapter element
   */
  const registerChapter = useCallback((ref) => {
    if (!ref || chaptersRef.current.includes(ref)) return;
    
    console.log('Registering chapter:', ref.id);
    console.log('Current chapters before:', chaptersRef.current.map(ch => ch.id));
    
    chaptersRef.current.push(ref);
    chaptersRef.current.sort((a, b) => {
      const aTop = a.getBoundingClientRect().top + window.scrollY;
      const bTop = b.getBoundingClientRect().top + window.scrollY;
      console.log(`Comparing positions - ${a.id}: ${aTop} vs ${b.id}: ${bTop}`);
      return aTop - bTop;
    });
    
    console.log('Current chapters after:', chaptersRef.current.map(ch => ch.id));
  }, []);

  /**
   * Removes a chapter from the registry
   * @param {HTMLElement} ref - DOM reference to remove
   */
  const unregisterChapter = useCallback((ref) => {
    if (!ref) return;
    chaptersRef.current = chaptersRef.current.filter(chapter => chapter !== ref);
  }, []);

  /**
   * Finds the next chapter after the current scroll position
   * @param {number} currentPosition - Current scroll position in pixels
   * @returns {HTMLElement|undefined} Next chapter element or undefined if none found
   */
  const getNextChapter = useCallback((currentPosition) => {
    if (!chaptersRef.current.length) {
      console.log('No chapters registered');
      return;
    }
    
    console.log('Current scroll position:', currentPosition);
    console.log('Available chapters:', chaptersRef.current.map(ch => ({
      id: ch.id,
      position: ch.getBoundingClientRect().top + window.scrollY
    })));
    
    const next = chaptersRef.current.find(chapter => {
      const chapterPosition = chapter.getBoundingClientRect().top + window.scrollY;
      console.log(`Chapter ${chapter.id} position:`, chapterPosition);
      return chapterPosition > currentPosition + 10;
    });
    
    console.log('Next chapter found:', next?.id);
    return next;
  }, []);

  const contextValue = {
    registerChapter,
    unregisterChapter,
    getNextChapter
  };

  return (
    <ChaptersContext.Provider value={contextValue}>
      {children}
    </ChaptersContext.Provider>
  );
};

/**
 * Hook to access the chapters context
 * @throws {Error} If used outside of ChaptersProvider
 * @returns {Object} Chapter context methods
 */
export const useChapters = () => {
  const context = useContext(ChaptersContext);
  
  if (!context) {
    throw new Error('useChapters must be used within a ChaptersProvider');
  }
  
  return context;
};

export default ChaptersProvider;