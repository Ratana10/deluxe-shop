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
  const [chatId, setChatId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Retrieve Telegram WebApp instance on the client-side
    const telegramApp = getWebApp();
    if (telegramApp) {
      setTg(telegramApp);
      setQueryId(telegramApp.initDataUnsafe?.query_id || null);
      setChatId(telegramApp.initDataUnsafe?.user?.id || null);
      setUser(telegramApp.initDataUnsafe?.user || null);
      telegramApp.ready(); // Mark the WebApp as ready
    }
  }, []);

  // Function to close the Telegram WebApp
  const onClose = useCallback(() => {
    tg?.close();
  }, [tg]);

  const showBackButton = useCallback(() => {

    if (tg?.BackButton) {
      tg.BackButton.show();
    }
  }, [tg])

  const hideBackButton = useCallback(() => {
    if (tg?.BackButton) {
      tg.BackButton.hide();
    }
  }, [tg]);

  // Function to toggle the visibility of the MainButton
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick); 
    }
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
    }
  }, [tg]);

  return {
    tg, // Telegram WebApp instance
    queryId, // Query ID from the WebApp
    user, // User details from the WebApp
    chatId, // User chat id
    onClose, // Function to close WebApp
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton
  };
};
