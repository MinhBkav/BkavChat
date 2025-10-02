// src/socket/state/onlineUsers.js
// Lưu 1 socketId cuối cùng cho mỗi user
const map = new Map(); // userId(string) -> socketId(string)

function setOnline(userId, socketId) {
  map.set(String(userId), String(socketId));
}

function setOffline(userId) {
  map.delete(String(userId));
}

function getSocketId(userId) {
  return map.get(String(userId)) || null;
}
function getmap(){
    return map;
}
function listUserIds() {
  return Array.from(map.keys());
}

function size() {
  return map.size;
}

function clear() {
  map.clear();
}

module.exports = {
  setOnline,
  setOffline,
  getSocketId,
  listUserIds,
  size,
  clear,
  getmap,
};
