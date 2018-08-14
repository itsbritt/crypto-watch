const express = require('express'),
      http = require('http'),
      socketIO = require('socket.io');

const port = 5000; // localhost port

const app = express();

const server = http.createServer(app); // server instance

const io = socketIO(server); // establishes socket


io.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('change color', (color) => {
        console.log('Color changed to: ', color);
        io.sockets.emit('change color', color);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
