/**
 * Chapter.jsx
 * ==========
 * 
 * Overview:
 * A wrapper component that automatically registers sections of content with
 * the Chapters context for scroll navigation. Creates a section element that
 * can be tracked and navigated to by the scroll anchor.
 * 
 * Key Features:
 * - Automatic registration with ChaptersContext
 * - Proper cleanup on unmount
 * - Preserves all section element props
 * - Ref-based position tracking
 * 
 * Technical Implementation:
 * - useRef for DOM reference
 * - useEffect for registration lifecycle
 * - Prop spreading for flexibility
 * - Proper cleanup handling
 */

import React, { useRef, useEffect } from 'react';
import { useChapters } from '../../contexts/ChaptersContext';

/**
 * Chapter component that registers itself with the chapters navigation system
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @param {Object} props.props - Additional props to pass to section element
 */
export const Chapter = ({ children, ...props }) => {
  const sectionRef = useRef(null);
  const { registerChapter, unregisterChapter } = useChapters();

  // Register/unregister this section with the chapters system
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (currentRef) {
      console.log(`Chapter mounting: ${currentRef.id}`);
      registerChapter(currentRef);
    }
    return () => {
      if (currentRef) {
        console.log(`Chapter unmounting: ${currentRef.id}`);
        unregisterChapter(currentRef);
      }
    };
  }, [registerChapter, unregisterChapter]);

  return (
    <section 
      ref={sectionRef}
      {...props}
    >
      {children}
    </section>
  );
};

export default Chapter;