import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const scrollOptions = {
      top: 0,
      left: 0,
      behavior: 'smooth'
    };

    // For smoother transition, add a small delay
    const timeoutId = setTimeout(() => {
      if (document.documentElement.scrollTop > 0) {
        window.scrollTo(scrollOptions);
      }
    }, navigationType === 'POP' ? 100 : 0);

    return () => clearTimeout(timeoutId);
  }, [pathname, navigationType, isFirstRender]);

  // Prevent initial animation
  useEffect(() => {
    if (isFirstRender) {
      window.scrollTo(0, 0);
    }
  }, [isFirstRender]);

  return null;
}

export default ScrollToTop; 