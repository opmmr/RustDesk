import React, { useState, useEffect, useCallback } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
const WS_API_URL = process.env.REACT_APP_WS_API_URL;
interface DesktopSessionData {
}
interface SessionCredentials {
}
interface UseRemoteDesktopHook {
  startSession: (credentials: SessionCredentials) => void;
  endSession: () => void;
  desktopData: DesktopSessionData | null;
  error: string | null;
  isConnected: boolean;
}
export const useRemoteDesktop = (): UseRemoteDesktopHook => {
  const [desktopData, setDesktopData] = useState<DesktopSessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<W3CWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const startSession = useCallback((credentials: SessionCredentials) => {
    const wsClient = new W3CWebSocket(`${WS_API_URL}?sessionId=${credentials.sessionId}`);
    wsClient.onopen = () => {
      setIsConnected(true);
      wsClient.send(JSON.stringify(credentials));
    };
    wsClient.onmessage = (message) => {
      const data: DesktopSessionData = JSON.parse(message.data.toString());
      setDesktopData(data);
    };
    wsClient.onerror = (e) => {
      setError('Connection error');
      console.error('WebSocket error:', e);
    };
    wsClient.onclose = () => {
      setIsConnected(false);
      setError('Connection closed');
    };
    setClient(wsClient);
  }, []);
  const endSession = useCallback(() => {
    if (client) {
      client.close();
      setClient(null);
      setIsConnected(false);
      setDesktopData(null);
    }
  }, [client]);
  useEffect(() => {
    return () => {
      if (client) {
        client.close();
      }
    };
  }, [client]);
  return {
    startSession,
    endSession,
    desktopData,
    error,
    isConnected,
  };
};