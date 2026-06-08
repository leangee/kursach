import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children, orderId }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl;

    if (orderId) {
      wsUrl = `${protocol}//${window.location.hostname}:8000/ws/orders/${orderId}/`;
    } else {
      wsUrl = `${protocol}//${window.location.hostname}:8000/ws/notifications/`;
    }

    const connect = () => {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        socketRef.current = ws;
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        
        if (data.type === 'status_update') {
          setNotifications(prev => [{
            id: Date.now(),
            title: 'Статус обновлён',
            message: `Заказ #${data.order_id}: ${data.old_status} → ${data.new_status}`,
            time: data.updated_at
          }, ...prev]);
        } else if (data.type === 'notification') {
          setNotifications(prev => [{
            id: Date.now(),
            title: data.title,
            message: data.message,
            time: data.created_at
          }, ...prev]);
        }
      };
      
      return ws;
    };

    const ws = connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user, isAuthenticated, orderId]);

  const clearNotifications = () => setNotifications([]);

  return (
    <WebSocketContext.Provider value={{ isConnected, notifications, clearNotifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};