import { useState, useCallback, useEffect, useRef } from 'react';
import { useWebSocket, WebSocketMessage } from './useWebSocket';

export interface ChatMessage {
  id: number;
  type: 'client' | 'supervisor' | 'system';
  message: string;
  time: string;
  senderName?: string;
}

export interface UseSupervisorChatOptions {
  sessionId: string | null;
}

export interface UseSupervisorChatReturn {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isConnected: boolean;
  isPaired: boolean;
  disconnect: () => void;
  error: string | null;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const useSupervisorChat = ({ sessionId }: UseSupervisorChatOptions): UseSupervisorChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPaired, setIsPaired] = useState(false);
  const [messageCounter, setMessageCounter] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasJoinedSessionRef = useRef(false);

  // Reset state when sessionId changes
  useEffect(() => {
    setMessages([]);
    setIsPaired(false);
    setError(null);
    hasJoinedSessionRef.current = false;
  }, [sessionId]);

  const handleMessage = useCallback((wsMessage: WebSocketMessage) => {
    console.log('Supervisor received message:', wsMessage);

    switch (wsMessage.type) {
      case 'CONNECT':
        // Initial connection acknowledgment
        if (wsMessage.payload?.message?.includes('please send sessionId')) {
          console.log('Acknowledged, ready to join session');
        }
        // Successfully joined session
        else if (wsMessage.payload?.paired) {
          setIsPaired(true);
          const systemMessage: ChatMessage = {
            id: Date.now(),
            type: 'system',
            message: 'Você entrou na sessão com sucesso',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, systemMessage]);
        }
        break;

      case 'MESSAGE':
        // Message from client
        if (wsMessage.from === 'CLIENT' && wsMessage.payload?.text) {
          const newMessage: ChatMessage = {
            id: Date.now(),
            type: 'client',
            message: wsMessage.payload.text as string,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            senderName: 'Cliente',
          };
          setMessages((prev) => [...prev, newMessage]);
        }
        break;

      case 'DISCONNECT':
        // Client disconnected
        const disconnectMessage: ChatMessage = {
          id: Date.now(),
          type: 'system',
          message: 'O cliente saiu da conversa',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, disconnectMessage]);
        setIsPaired(false);
        break;

      case 'ERROR':
        // Error from server
        const errorText = wsMessage.payload?.error as string || 'Erro desconhecido';

        // Check if it's a session error
        if (errorText.includes('Session not found') || errorText.includes('Failed to join session')) {
          setError(errorText);
        }

        const errorMessage: ChatMessage = {
          id: Date.now(),
          type: 'system',
          message: `Erro: ${errorText}`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
        break;
    }
  }, []);

  const handleOpen = useCallback(() => {
    console.log('Supervisor connected to WebSocket');
  }, []);

  const handleClose = useCallback(() => {
    console.log('Supervisor disconnected from WebSocket');
    setIsPaired(false);
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
  }, []);

  const { sendMessage: wsSendMessage, isConnected, disconnect } = useWebSocket({
    url: `${WS_URL}/ws/supervisor`,
    shouldConnect: sessionId !== null, // Only connect if sessionId is provided
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
  });

  // Join session when connected
  useEffect(() => {
    if (isConnected && sessionId && !hasJoinedSessionRef.current) {
      console.log('Joining session with sessionId:', sessionId);
      hasJoinedSessionRef.current = true;

      // Small delay to ensure connection is fully established
      const timeoutId = setTimeout(() => {
        const joinMessage: WebSocketMessage = {
          sessionId,
          from: 'SUPERVISOR',
          type: 'CONNECT',
          payload: {
            message: 'Supervisor joining session',
          },
        };
        wsSendMessage(joinMessage);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, sessionId, wsSendMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!isPaired) {
        console.warn('Cannot send message: Not paired with client');
        return;
      }

      if (!text.trim()) {
        return;
      }

      // Add message to local state immediately
      const newMessage: ChatMessage = {
        id: messageCounter,
        type: 'supervisor',
        message: text,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        senderName: 'Você',
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageCounter((prev) => prev + 1);

      // Send via WebSocket
      const wsMessage: WebSocketMessage = {
        sessionId,
        from: 'SUPERVISOR',
        type: 'MESSAGE',
        payload: {
          text,
          timestamp: new Date().toISOString(),
        },
      };
      wsSendMessage(wsMessage);
    },
    [isPaired, sessionId, wsSendMessage, messageCounter]
  );

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      console.log('Supervisor chat hook unmounting, disconnecting...');
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset joined flag when sessionId changes
  useEffect(() => {
    hasJoinedSessionRef.current = false;
    setIsPaired(false);
  }, [sessionId]);

  return {
    messages,
    sendMessage,
    isConnected,
    isPaired,
    disconnect,
    error,
  };
};
