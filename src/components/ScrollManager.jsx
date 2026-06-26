import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

export default function ScrollManager() {
  const { pathname, key } = useLocation();
  const prevKey = useRef(key);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const isBack = window.history.state?.idx < (window.history.state?.idx ?? 0);

    if (pathname !== prevPath.current) {
      if (isBack && scrollPositions[pathname]) {
        // Restore instantly with no animation
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPositions[pathname], behavior: 'instant' });
        });
      } else {
        // Forward navigation - go to top
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }

    // Save scroll position on scroll
    const saveScroll = () => {
      scrollPositions[prevPath.current] = window.scrollY;
    };

    window.addEventListener('scroll', saveScroll, { passive: true });
    prevPath.current = pathname;
    prevKey.current = key;

    return () => window.removeEventListener('scroll', saveScroll);
  }, [pathname, key]);

  return null;
}
