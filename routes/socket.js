module.exports = function (socket) {
    socket.on('annotations:create', function (data) {
        console.log(data);
    });
};
