var _ = require('underscore');

module.exports = function(server){
    var getRoomUsers = function(room) {
        return _.map(room, function(obj) {
            return _.pick(obj, 'userName', 'id');
        }); //returns an array of user objects containing userName and id
    };

    // Set up socket.io
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket) {
        console.log('connected');
        socket.on('room', function(room) {
            socket.join(room); //join socket room based on client's roomHash
            if (typeof socket.userName === 'undefined') {
                socket.userName = "Guest" + io.sockets.clients(room).length; //assign a Guest name if client has no userName
            }
            socket.userRoom = room;
            io.sockets.in(room).emit('users:update', getRoomUsers(io.sockets.clients(room))); //update the room's clients with the updated userlist

        });

        socket.on('name:change', function(data) {
            socket.userName = data;
            io.sockets.in(socket.userRoom).emit('users:update', getRoomUsers(io.sockets.clients(socket.userRoom)));
        })

        socket.on('disconnect', function() {
            socket.leave(socket.userRoom);
            io.sockets.in(socket.userRoom).emit('users:update', getRoomUsers(io.sockets.clients(socket.userRoom)));
        })
    });
}
