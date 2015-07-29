var http = require('http'),
    config = require('./config/config');

config.Db.connect ();
var server = http.createServer(config.App);
require('./routes/socket.js')(server);

module.exports = server;
