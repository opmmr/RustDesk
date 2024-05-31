import React, { useState, useEffect, useCallback } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const WS_API_URL = process.env.REACT_APP_WS_API_URL;

interface DesktopSessionData {
  // Structure of your desktop data
}

interface SessionCredentials {
  sessionId: string; // Assuming sessionId is part of your credentials for demonstration
  // Any other credential fields
}

interface UseRemoteDesktopHook {
  startSession: (credentials: SessionCredentials) => void;
  endSession: () => void;
  desktopData: DesktopSessionData | null;
  error: string | null;
  isConnected: boolean;
  setReconnectAttempts: (attempts: number) => void;
}

export const useRemoteDesktop = (): UseRemoteDesktopHook => {
  const [desktopData, setDesktopData] = useState<DesktopSessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<W3CWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  const connectWebSocket = useCallback((credentials: SessionCredentials) => {
    const wsClient = new W3CWebSocket(`${WS_API_URL}?sessionId=${credentials.sessionId}`);
    return wsClient;
  }, []);

  const onOpenHandler = useCallback((credentials: SessionCredentials, wsClient: W3CWebSocket) => {
    setIsConnected(true);
    setError(null);
    wsClient.send(JSON.stringify(credentials));
  }, []);

  const onMessageHandler = useCallback((message: MessageEvent) => {
    const data: DesktopSessionData = JSON.parse(message.data.toString());
    setDesktopData(data);
  }, []);

  const onErrorHandler = useCallback((e: Event) => {
    setError('WebSocket error. Check console for more details.');
    console.error('WebSocket error:', e);
  }, []);

  const onCloseHandler = useCallback(() => {
    setIsConnected(false);
    setError('Connection closed. Attempting to reconnect...');
    if (reconnectAttempts > 0 && client) {
      setTimeout(() => client.connect(), 5000); // Reconnect after 5 seconds
      setReconnectAttempts(attempt => attempt - 1);
    }
  }, [reconnectAttempts, client]);

  const startSession = useCallback((credentials: SessionCredentials) => {
    const wsClient = connectWebSocket(credentials);
    wsClient.onopen = () => onOpenHandler(credentials, wsClient);
    wsClient.onmessage = onMessageHandler;
    wsClient.onerror = onErrorHandler;
    wsClient.onclose = onCloseHandler;
    setClient(wsClient);
  }, [connectWebSocket, onOpenHandler, onMessageHandler, onErrorHandler, onCloseHandler]);

  const endSession = useCallback(() => {
    if (client) {
      client.close();
      setClient(null);
      setIsConnected(false);
      setDesktopData(null);
      setError(null);
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
    setReconnectAttempts,
  };
};