app.controller('VaWidgetController', ['$scope', 'socket', '$sce',
    function ($scope, socket, $sce) {

        var onLeave = function onLeave(currentTime, timeLapse, params) {
            params.completed = false;
            params.selected = false;

            // clear expired annotations
            var i = $scope.inlineAnnotations.indexOf(params);
            if (i !== -1) {
                $scope.inlineAnnotations.splice(i, 1);
            }
        };

        var onComplete = function onComplete(currentTime, timeLapse, params) {
            params.completed = true;
            params.selected = false;

            // clear expired annotations
            var i = $scope.inlineAnnotations.indexOf(params);
            if (i !== -1) {
                $scope.inlineAnnotations.splice(i, 1);
            }
        };

        var onUpdate = function onUpdate(currentTime, timeLapse, params) {
            if (!params.selected) {
                params.completed = false;
                params.selected = true;
                // add to inline annotations
                var i = $scope.inlineAnnotations.indexOf(params);
                if (i === -1) {
                    $scope.inlineAnnotations.push(params);
                }
            }
        };

        $scope.createAnnotation = function () {
            // get current playback time
            var defaultStartTime = Math.floor($scope.API.currentTime / 1000);
            var defaultEndTime = defaultStartTime + 5;

            var defaultAnnotation = {
                "start": defaultStartTime,
                "end": defaultEndTime,
                "position": {
                    "top": "100",
                    "left": "100"
                },
                "size": {
                    "height": "200",
                    "width": "200"
                },
                "text": '',
                "author": "Anonymous", //TODO - get author
                "video_id": $scope.config.source.id
            };
            $scope.selectedAnnotation = defaultAnnotation;
        };

        $scope.selectAnnotation = function (annotation, seek) {
            if (seek === true) {
                $scope.API.seekTime(annotation.start);
            }
            $scope.selectedAnnotation = annotation;
        };

        $scope.onPlayerReady = function (API) {
            $scope.API = API;
        };

        this.init = function () {
            $scope.cuePoints = {
                points: []
            };
            $scope.annotations = [];
            $scope.inlineAnnotations = [];
            $scope.API = null;

            var videoSource = $scope.config.source;
            $scope.sources = [{
                src: $sce.trustAsResourceUrl(videoSource.src),
                type: 'video/mp4'
            }];

            // IO request annotations
            var params = {
                video_id: videoSource.id
            };
            socket.emit('annotations:get', params);
        };

        socket.on('annotations:updated', function (annotations) {

            // clear current annotations state
            $scope.annotations = [];
            $scope.cuePoints.points = [];
            $scope.inlineAnnotations = [];
            $scope.selectedAnnotation = null;

            _.sortBy(annotations, 'start')
                .forEach(function (annotation) {
                    var cuePoint = {
                        timeLapse: {
                            start: annotation.start,
                            end: annotation.end
                        },
                        onLeave: onLeave,
                        onUpdate: onUpdate,
                        onComplete: onComplete,
                        params: annotation
                    };

                    $scope.annotations.push(annotation);
                    $scope.cuePoints.points.push(cuePoint);
                });
        });

        // Initialize controller
        this.init();
    }
]);
