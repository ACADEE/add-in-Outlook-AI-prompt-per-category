import React, { createContext, useContext, useState, useEffect } from 'react';

export type ApiStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface ApiContextType {
  apiStatus: ApiStatus;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  checkApiConnection: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('disconnected');
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const checkApiConnection = async () => {
    if (!apiKey) {
      setApiStatus('disconnected');
      return;
    }

    setApiStatus('connecting');

    try {
      // Test API connection
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
      console.error('API connection error:', error);
    }
  };

  useEffect(() => {
    // Load API key from localStorage on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      checkApiConnection();
    }
  }, [apiKey]);

  const value: ApiContextType = {
    apiStatus,
    apiKey,
    setApiKey,
    checkApiConnection,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
