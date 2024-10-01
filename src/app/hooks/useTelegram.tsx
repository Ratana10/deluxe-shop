import { useState, useEffect, useCallback } from 'react';
import type { WebApp } from '@twa-dev/types';

// Define the Telegram WebApp in the global context
declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

// Utility function to access the Telegram WebApp
export const getWebApp = (): WebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Custom Hook to manage Telegram WebApp interaction
export const useTelegram = () => {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Retrieve Telegram WebApp instance on the client-side
    const telegramApp = getWebApp();
    if (telegramApp) {
      setTg(telegramApp);
      setQueryId(telegramApp.initDataUnsafe?.query_id || null);
      setUser(telegramApp.initDataUnsafe?.user || null);
      telegramApp.ready(); // Mark the WebApp as ready
    }
  }, []);

  // Function to close the Telegram WebApp
  const onClose = useCallback(() => {
    tg?.close();
  }, [tg]);

  // Function to toggle the visibility of the MainButton
  const onToggleButton = useCallback(() => {
    if (tg?.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  }, [tg]);

  return {
    tg, // Telegram WebApp instance
    queryId, // Query ID from the WebApp
    user, // User details from the WebApp
    onClose, // Function to close WebApp
    onToggleButton, // Function to toggle MainButton
  };
};
