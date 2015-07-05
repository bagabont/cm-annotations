var path = require('path'),
    http = require('http'),
    app = require('./config/express')(),
    socket = require('./routes/socket.js');

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

module.exports = server;
