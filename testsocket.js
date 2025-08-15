// test-client.js
const { io } = require("socket.io-client");

const socket = io("http://30.30.30.12:8080", {
  auth: {
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjg2MzgxODI3MDUzNTg1NzczYjkxYTMwIiwiRnVsbE5hbWUiOiJtaW5oIiwiaWF0IjoxNzUxMzU5MzEwLCJleHAiOjMzMjg3MzU5MzEwfQ.Gi3R9OYdHULYmedWWq3SF763Uzg0Bv-3Bat0JsIQvjQ"
  }
});

socket.on("connect", () => {
  console.log("✅ Connected with socket id:", socket.id);

  // Gửi thử một tin nhắn
  socket.emit("send_message", {
    toUserId: "6863a02b699f81f9ff4f89a0",
    content: "Hello from test client",
    images: [],
    files: []
  });

  // Yêu cầu lịch sử chat
  socket.emit("load_history", {
    friendId: "6863a02b699f81f9ff4f89a0"
  });
});

// Nhận tin nhắn gửi đi thành công
socket.on("message_sent", (msg) => {
  console.log("📤 message_sent:", msg);
});

// Nhận tin nhắn đến
socket.on("receive_message", (msg) => {
  console.log("📥 receive_message:", msg);
});

// Nhận lịch sử tin nhắn
socket.on("chat_history", (messages) => {
  console.log("📚 chat_history:", messages);
});

// Báo lỗi kết nối
socket.on("connect_error", (err) => {
  console.error("❌ connect_error:", err.message);
});
socket.on("disconnect",()=>{
  
})