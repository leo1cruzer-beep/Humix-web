import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = {};

export default function ScrollManager() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (navType === 'POP') {
      // Back/forward - restore saved position instantly
      const saved = scrollPositions[pathname] || 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved, behavior: 'instant' });
      });
    } else {
      // Forward navigation - go to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const saveScroll = () => {
      scrollPositions[prevPath.current] = window.scrollY;
    };

    window.addEventListener('scroll', saveScroll, { passive: true });
    prevPath.current = pathname;

    return () => window.removeEventListener('scroll', saveScroll);
  }, [pathname, navType]);

  return null;
}
