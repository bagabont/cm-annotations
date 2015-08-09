var app = angular.module('VideoAnnotations', [
    'ngSanitize',
    'ngRoute',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'info.vietnamcode.nampnq.videogular.plugins.youtube'
]);

app.controller('VideoAnnotationsController', ['source',
    function (source) {
        this.config = {
            source: source.data
        };
    }
]);
