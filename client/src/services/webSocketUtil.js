export const socket = new WebSocket('ws://localhost:8088/websocket');

socket.onopen = () => {
  console.log('WebSocket connection established.');
};

socket.onclose = () => {
  console.log('WebSocket connection closed.');
};


// export const setupSocketListeners = (onMessageCallback) => {
//   socket.onmessage = (event) => {
//     const receivedData = JSON.parse(event.data);
//     console.log(receivedData)
//     onMessageCallback(receivedData);
//   };
// };

export const setupSocketListeners = (onMessageCallback) => {
  const handleMessage = (event) => {
    const receivedData = JSON.parse(event.data);
    console.log(receivedData);
    onMessageCallback(receivedData);
  };

  socket.addEventListener('message', handleMessage);

  return () => {
    socket.removeEventListener('message', handleMessage);
  };
};
