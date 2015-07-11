var app = angular.module('VideoAnnotations', [
    'ngSanitize',
    'ngRoute',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'info.vietnamcode.nampnq.videogular.plugins.youtube'
]);

app.controller('VideoAnnotationsController', ['sources', 'annotations',
    function (sources, annotations) {
        this.config = {
            sources: sources.data,
            annotations: annotations.data
        };
    }
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
