const presence = require('../State/OnlineUsers'); // map online

module.exports=(io)=>
{
    const otherOnlineUsers = Array.from(presence.getmap().entries()).map(([userId, _]) => userId);
    io.emit("online_users", otherOnlineUsers);
}