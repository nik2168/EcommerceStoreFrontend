// context/SocketInit.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "./socket";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketInit = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nox_token");

    const socketInstance = initializeSocket(token || "");
    setSocket(socketInstance);
    setLoading(false);

    return () => {
      disconnectSocket();
    };
  }, []);

  if (loading) return null; // Prevents child components from using uninitialized socket

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketInit;
