// // WebSocketContext.js
// import React, { createContext, useContext, useEffect, useRef } from 'react';

// // const WebSocketContext = createContext();

// export const SocketContext = React.createContext({ socket: null });

// const WebSocketProvider = ({ children }) => {
//     const socketRef = useRef(new WebSocket('ws://localhost:8088/websocket'));

//     useEffect(() => {
//         socketRef.current.onopen = () => {
//             console.log('WebSocket connection established.');
//         };

//         socketRef.current.onclose = () => {
//             console.log('WebSocket connection closed.');
//         };

//         return () => {
//             if (socketRef && socketRef.current) {
//                 // socketRef.current.removeAllListeners();
//                 socketRef.current.close();
//             }
//         };
//     }, []);

//     return (
//         <SocketContext.Provider value={{ socket: socketRef.current }}>{children}</SocketContext.Provider>
//       );
// }
// export default WebSocketProvider;


// export const useSocketSubscribe = (eventHandler) => {
// 	// Get the socket instance
// 	const { socket } = useContext(SocketContext);

// 	// when the component, *which uses this hook* mounts,
// 	// add a listener.
// 	useEffect(() => {
// 		console.log('adding listener');
//         const messageListener = (event) => {
//             const message = JSON.parse(event.data);
//             eventHandler(message);
//           };
      
//           socket.addEventListener('message', messageListener);
      
//           return () => {
//             console.log('WebSocket: removing message listener');
//             socket.removeEventListener('message', messageListener);
// 		};

// 	// Sometimes the handler function gets redefined
// 	// when the component using this hook updates (or rerenders)
// 	// So adding a dependency makes sure the handler is
// 	// up to date!
// 	}, [eventHandler]);

// };


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


///////////
import React, { createContext, useContext, useEffect, useRef } from 'react';

export const SocketContext = createContext();

const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null); // Initialize with null

    useEffect(() => {
        // Create the WebSocket instance
        socketRef.current = new WebSocket('ws://localhost:8088/websocket');

        // Event handlers
        socketRef.current.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        // Cleanup on unmount
        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};

export default WebSocketProvider;

export const useSocketSubscribe = (eventHandler) => {
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            const messageListener = (event) => {
                const message = JSON.parse(event.data);
                eventHandler(message);
            };
      
            socket.addEventListener('message', messageListener);
      
            return () => {
                console.log('WebSocket: removing message listener');
                socket.removeEventListener('message', messageListener);
            };
        }
    }, [socket, eventHandler]);
};

export const useWebSocketSender = () => {
    const { socket } = useContext(SocketContext);

    // const sendMessage = (message) => {
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send(JSON.stringify(message));
    //     } else {
    //         console.log('WebSocket connection is not open.');
    //     }
    // };


    const sendMessage = (message) => {
        if (socket) {
            console.log('WebSocket connection state:', socket.readyState);
            
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
                console.log('Message sent:', message);
            } else {
                console.log('WebSocket connection is not open.');
            }
        } else {
            console.log('Socket is not available.');
        }
    };

    return sendMessage;
};
