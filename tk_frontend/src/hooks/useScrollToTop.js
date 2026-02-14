/**
 * useScrollToTop Hook
 * Scrolls to top of page on route change
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollContext } from '../context/ScrollContext';

const useScrollToTop = () => {
  const { pathname } = useLocation();
  const { skipScroll, setSkipScroll } = useScrollContext();

  useEffect(() => {
    if (!skipScroll) {
      window.scrollTo(0, 0);
    }
    setSkipScroll(false);
  }, [pathname, skipScroll, setSkipScroll]);
};

export default useScrollToTop;
