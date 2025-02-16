module.exports = {
    createSocketService: (io) => {
        global.onlineUsers = new Map();
        io.on("connection", (socket) => {
            global.chatSocket = socket;
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-receive", data.msg);
                }
            });
        });
    },
}