import React from 'react';
import { useApi } from '@/contexts/ApiContext';

export const Footer: React.FC = () => {
  const { apiStatus } = useApi();

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-blue-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'disconnected':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return 'Connecté';
      case 'connecting':
        return 'Connexion...';
      case 'error':
        return 'Erreur de connexion';
      case 'disconnected':
        return 'Déconnecté';
      default:
        return 'Déconnecté';
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🔵';
      case 'error':
        return '🔴';
      case 'disconnected':
        return '⚪';
      default:
        return '⚪';
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-sm text-gray-600">
          © 2026 AI Novel Architect
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">État de l'API:</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
