// WebSocketProvider.js
import React, { createContext, useEffect, useRef, useContext } from 'react';

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(new WebSocket('ws://localhost:8088/websocket'));

  useEffect(() => {
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Handle incoming messages from the server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message from server:', message);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;

// useWebSocketSubscribe.js
import { useContext, useEffect } from 'react';
import { WebSocketContext } from './WebSocketProvider';

export const useWebSocketSubscribe = (eventHandler) => {
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    console.log('WebSocket: adding message listener');

    const messageListener = (event) => {
      const message = JSON.parse(event.data);
      eventHandler(message);
    };

    socket.addEventListener('message', messageListener);

    return () => {
      console.log('WebSocket: removing message listener');
      socket.removeEventListener('message', messageListener);
    };
  }, [eventHandler]);
};


// export const useWebSocketSender = () => {
//     const { socket } = useContext(SocketContext);

//     const sendMessage = (message) => {
//         if (socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify(message));
//         } else {
//             console.log('WebSocket connection is not open.');
//         }
//     };

//     return sendMessage;
// };