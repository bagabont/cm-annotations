var app = angular.module('vgAnnotationApp', [
    'ngSanitize',
    'ngRoute',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'info.vietnamcode.nampnq.videogular.plugins.youtube'
]);

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
