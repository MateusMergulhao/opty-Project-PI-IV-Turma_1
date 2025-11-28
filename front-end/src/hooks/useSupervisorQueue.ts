
/* --- IMPORTS --- */
import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';


/* --- TYPES --- */
// Session information structure
export interface SessionInfo {
  sessionId: string;
  paired: boolean;
  createdAt: string;
  waitingTimeMinutes: number;
  waitingTimeSeconds: number;
}

// Supervisor queue hook options and return types
export interface UseSupervisorQueueOptions {
  enabled?: boolean;
}


// Supervisor queue hook return type
export interface UseSupervisorQueueReturn {
  availableSessions: SessionInfo[];
  isConnected: boolean;
  acceptSession: (sessionId: string) => void;
}

/* --- CONSTANTS --- */
const WS_URL = import.meta.env.VITE_WS_URL;
const API_URL = import.meta.env.VITE_JAVA_API_URL;


/**
 * Hook to manage supervisor queue - receives real-time updates of available chat sessions
 */
export const useSupervisorQueue = ({ enabled = true }: UseSupervisorQueueOptions = {}): UseSupervisorQueueReturn => {
  const [availableSessions, setAvailableSessions] = useState<SessionInfo[]>([]);

  // Fetch initial sessions from REST API
  useEffect(() => {
    if (!enabled) return;

    const fetchInitialSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions/available`);
        if (response.ok) {
          const sessions: SessionInfo[] = await response.json();
          setAvailableSessions(sessions);
          console.log('Loaded initial sessions:', sessions);
        }
      } catch (error) {
        console.error('Error fetching initial sessions:', error);
      }
    };

    fetchInitialSessions();
  }, [enabled]);

  const handleMessage = useCallback((wsMessage: any) => {
    console.log('Queue received message:', wsMessage);

    switch (wsMessage.type) {
      case 'SESSION_QUEUE_UPDATE':
        // Update available sessions list
        if (wsMessage.payload?.sessions) {
          setAvailableSessions(wsMessage.payload.sessions as SessionInfo[]);
          console.log('Queue updated:', wsMessage.payload.sessions);
        }
        break;

      case 'CONNECT':
        console.log('Queue listener connected:', wsMessage.payload?.message);
        break;

      default:
        console.log('Unhandled message type in queue:', wsMessage.type);
    }
  }, []);

  const handleOpen = useCallback(() => {
    console.log('Supervisor queue listener connected');
  }, []);

  const handleClose = useCallback(() => {
    console.log('Supervisor queue listener disconnected');
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('Queue WebSocket error:', error);
  }, []);

  const { sendMessage: wsSendMessage, isConnected, disconnect } = useWebSocket({
    url: `${WS_URL}/ws/supervisor`,
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    shouldConnect: enabled, // Only connect when enabled
  });

  
  /**
   * Accept a session - DISCONNECT from queue and let parent component handle chat connection
   */
  const acceptSession = useCallback(
    (sessionId: string) => {
      if (!isConnected) {
        console.warn('Cannot accept session, not connected');
        return;
      }

      console.log('Accepting session, disconnecting from queue:', sessionId);
      // Disconnect from queue WebSocket - parent will handle chat connection
      disconnect();
    },
    [isConnected, disconnect]
  );

  return {
    availableSessions,
    isConnected,
    acceptSession,
  };
};
