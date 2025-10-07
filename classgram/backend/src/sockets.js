export function setupSockets(io) {
  io.on('connection', (socket) => {
    const { userId } = socket.handshake.auth || {};
    if (userId) socket.join(`user:${userId}`);

    socket.on('join', (room) => socket.join(room));

    socket.on('disconnect', () => {});
  });
}
