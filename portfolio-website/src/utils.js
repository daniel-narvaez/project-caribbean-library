import { put } from '@vercel/blob';

export const getImageUrl = (path) => new URL(`/assets/${path}`, import.meta.url).href;

export const getArticle = (word) => {
  // Convert to lowercase to simplify checking
  const firstLetter = word.charAt(0).toLowerCase();
  
  // Check if first letter is a vowel
  const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter);
  
  return isVowel ? 'an' : 'a';
}

export function zeroToAutoHeight(element, shouldExpand, options = {}, initialHeight = 0) {
    const {
        // transition = '',
        onStart,
        onComplete
    } = options;

    // Store the current height of the element
    const currentHeight = initialHeight;

    
    // Get the target height
    let targetHeight;
    if (shouldExpand) {
        element.style.height = 'auto';
        targetHeight = element.offsetHeight + 'px';
        element.style.height = currentHeight + 'px';
    } else {
        targetHeight = initialHeight + 'px';
    }

    // Optional callback before transition starts
    if(onStart) onStart({ currentHeight, targetHeight });

    // // Set the transition
    // element.style.transition = `${transition}`;

    // Trigger transition to the new height
    requestAnimationFrame(() => {
        element.style.height = targetHeight;
        if (onComplete) onComplete({ height: targetHeight });
    });
}

export async function uploadVideoToBlob(file) {
  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error('Error uploading to blob', error);
    return null;
  }
}