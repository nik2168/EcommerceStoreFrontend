// lib/socket.js
import { io } from "socket.io-client";
import { server } from "../features/config";

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(server, {
      transports: ["websocket"],
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket)
    throw new Error(
      "❗ Socket not initialized. Call initializeSocket() first."
    );
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
