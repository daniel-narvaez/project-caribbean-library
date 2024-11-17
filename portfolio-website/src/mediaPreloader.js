import { useState, useEffect} from 'react';

export const usePreloader = (mediaItems, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    stopOnError = false,
    timeout = 30000
  } = options;

  useEffect(() => {

    if (isInitialized) return;
    setIsInitialized(true);

    let mounted = true;
    const errorItems = [];

    const preloadMedia = (item) => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout loading: ${item.url}`));
        }, timeout);

        if (item.type === 'video') {
          const video = document.createElement('video');
          video.src = item.url;

          video.onloadeddata = () => {
            clearTimeout(timeoutId);
            resolve();
          };

          video.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load video: ${item.url}`));
          };
        } else if (item.type === 'image') {
          const img = new Image();
          img.src = item.url;

          img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          }

          img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load image: ${item.url}`));
          }
        } else {
          resolve();
        }
      });
    };

    const loadAll = async () => {
      const total = mediaItems.length;
      let loaded = 0;

      const promises = mediaItems.map(async(item, index) => {
        try {
          await preloadMedia(item);
          loaded++;
          if (mounted) {
            setProgress((loaded / total) * 100);
          }
        } catch (error) {
          errorItems.push({ item, error: error.message });
          if (onError) onError(error, item);
          if (stopOnError) throw error;
        }
      });

      try {
        await Promise.all(promises);
        if (mounted) {
          setErrors(errorItems);
          setIsLoading(false);
          (onComplete) && onComplete();
        }
      } catch (error) {
        if (mounted) {
          setErrors(errorItems);
          setIsLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, [mediaItems, stopOnError, timeout]);

  return {
    isLoading,
    progress,
    errors,
    hasErrors: errors.length > 0
  };
};