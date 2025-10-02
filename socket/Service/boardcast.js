const moment = require('moment');
const { models } = require('../../database');
const presence = require('../State/OnlineUsers');
const { ObjectId } = require('mongoose').Types

    async function broadcastToRoom(io,roomId, excludeUserId, event, payload) {
      try {
        const room = await models.Room.findById(roomId).lean();
        if (!room) return;

        for (const p of room.participants || []) {
          const pid =
              (p.userId || p._id || p.id)?.toString?.() ||
              (typeof p === 'string' ? p : null);
          if (!pid || pid === excludeUserId.toString()) continue;

          const sid = presence.getSocketId(pid);
          if (sid) io.to(sid).emit(event, payload);
        }
      } catch (e) {
        console.error('broadcastToRoom error:', e.message);
      }
    };

module.export ={broadcastToRoom};