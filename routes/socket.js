// export function for listening to the socket
module.exports = function(socket) {

    socket.on('annotations:create', function(data) {
        console.log(data);
    });
};
