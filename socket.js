// socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  autoConnect: false,
  reconnection: true,
});

// Kết nối khi cần (sau login)
export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ Không có token, không kết nối socket");
    return;
  }

socket.auth = { token: `Bearer ${token}` };
  if (!socket.connected) {
    socket.connect();
  }
};

// Ngắt kết nối khi logout
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
