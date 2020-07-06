var socket = require('socket.io');
var Comment = require('./models/comment');

let io;

const socketInit = function (server) {
    io = socket(server);
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    return io;
}

const emit = function (type, data) {
    io.emit(type, data);
}

module.exports = { socketInit, emit };