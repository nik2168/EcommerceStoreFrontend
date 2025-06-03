// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { server } from "../features/config";

const useSocket = () => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(server, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
