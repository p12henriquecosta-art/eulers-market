import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../lib/analytics';

/**
 * Fires a GA4 page_view event on every route change.
 * Mount once inside <BrowserRouter> (already done in App.tsx).
 */
export function usePageView(): void {
  const location = useLocation();

  useEffect(() => {
    track.pageView({
      page_path:  location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
}
