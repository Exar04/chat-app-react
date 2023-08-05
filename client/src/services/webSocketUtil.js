const socket = new WebSocket('ws://localhost:8088/websocket');

socket.onopen = () => {
  console.log('WebSocket connection established.');
};

socket.onclose = () => {
  console.log('WebSocket connection closed.');
};

export default socket;
