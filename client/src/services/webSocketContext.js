import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return data;
};

export default useWebSocket;

