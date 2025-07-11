import { useState, useEffect } from 'react';

export const useMedia = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkMediaQuery = () => {
      // Desktop: 1280px and above
      const desktopQuery = window.matchMedia('(min-width: 1280px)');
      // Tablet: 768px to 1279px
      const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1279px)');

      setIsDesktop(desktopQuery.matches);
      setIsTablet(tabletQuery.matches);
    };

    // Check on mount
    checkMediaQuery();

    // Add event listeners for resize
    const handleResize = () => {
      checkMediaQuery();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isDesktop, isTablet };
};