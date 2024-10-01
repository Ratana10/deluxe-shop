import type { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}



export function getWebApp(): WebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}