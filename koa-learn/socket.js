/**
 * socket.io
 */
var socket_io = require('socket.io');
var SocketIo = {
    initSocketIo: function (server) {
        var io = socket_io.listen(server)

        var users = [];
        io.on('connection', function(socket){
            socket.on('chat message', function(msg){
                io.emit('chat message', msg);
            });
            socket.on('login', function(data){
                users.push(data.username);
                var s = new Set(users);
                users = Array.from(s);
                socket.emit('users',users);
            });
        });
    }
}

module.exports = SocketIo;
