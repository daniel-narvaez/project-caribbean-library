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

    chaptersRef.current.push(ref);
    
    // Sort chapters by their vertical position in the document
    chaptersRef.current.sort((a, b) => {
      const aTop = a.getBoundingClientRect().top;
      const bTop = b.getBoundingClientRect().top;
      return aTop - bTop;
    });
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
    if (!chaptersRef.current.length) return;

    return chaptersRef.current.find(chapter => {
      const chapterPosition = chapter.getBoundingClientRect().top + window.scrollY;
      return chapterPosition > currentPosition;
    });
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