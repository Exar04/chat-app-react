const socket = new WebSocket('ws://your-websocket-server-url');

socket.onopen = () => {
  console.log('WebSocket connection established.');
};

socket.onclose = () => {
  console.log('WebSocket connection closed.');
};

export default socket;
