import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AppRoute = 'home' | 'shop' | 'product' | 'checkout' | 'about' | 'legal' | 'admin' | 'not_found';

interface RouteState {
  pathname: string;
  search: string;
  hash: string;
  route: AppRoute;
  searchParams: URLSearchParams;
}

function resolveRoute(pathname: string): AppRoute {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/index.html') return 'home';
  if (clean === '/shop' || clean === '/shop.html') return 'shop';
  if (clean === '/product' || clean === '/product.html') return 'product';
  if (clean === '/checkout' || clean === '/checkout.html') return 'checkout';
  if (clean === '/about' || clean === '/about.html') return 'about';
  if (clean === '/legal' || clean === '/legal.html') return 'legal';
  if (clean === '/admin' || clean === '/admin.html') return 'admin';
  return 'not_found';
}

function readLocation(): RouteState {
  const pathname = window.location.pathname || '/';
  const search = window.location.search || '';
  const hash = window.location.hash || '';
  return {
    pathname,
    search,
    hash,
    route: resolveRoute(pathname),
    searchParams: new URLSearchParams(search),
  };
}

interface RouterContextValue extends RouteState {
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<RouteState>(() => readLocation());

  const scrollToHashOrTop = useCallback((hash: string) => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const next = readLocation();
      setState(next);
      scrollToHashOrTop(next.hash);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [scrollToHashOrTop]);

  const navigate = useCallback(
    (to: string) => {
      if (to.startsWith('http://') || to.startsWith('https://')) {
        window.open(to, '_blank', 'noopener,noreferrer');
        return;
      }
      if (to.startsWith('/admin/')) {
        window.location.href = to;
        return;
      }

      const url = new URL(to, window.location.origin);
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const samePath = url.pathname === window.location.pathname && url.search === window.location.search;

      window.history.pushState({}, '', nextUrl);
      const next = readLocation();
      setState(next);

      if (samePath && url.hash) {
        scrollToHashOrTop(url.hash);
      } else {
        scrollToHashOrTop(next.hash);
      }
    },
    [scrollToHashOrTop]
  );

  return <RouterContext.Provider value={{ ...state, navigate }}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
