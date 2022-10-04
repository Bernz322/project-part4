const socketIO = require('socket.io');

exports.sio = server => {
    return socketIO(server, {
        transport: ["polling"],
        cors: { origin: "*" },
    });
};

exports.connection = io => {
    io.on('connection', socket => { // When a user connects
        // When a user sends a message, send message back to frontend
        socket.on("send_message", (message) => {
            socket.broadcast.emit("receive_message", message);
        });

        socket.off("setup", () => {
            console.log(`Socket ${socket.id} has disconnected`);
            socket.leave(id);
        });
    });
};