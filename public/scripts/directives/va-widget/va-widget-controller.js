app.controller('VaWidgetController', ['$scope', 'socket', '$sce',
    function($scope, socket, $sce) {

        var onLeave = function onLeave(currentTime, timeLapse, params) {
            params.completed = false;
            params.selected = false;
        };

        var onComplete = function onComplete(currentTime, timeLapse, params) {
            params.completed = true;
            params.selected = false;
        };

        var onUpdate = function onUpdate(currentTime, timeLapse, params) {
            if (!params.selected) {
                params.completed = false;
                params.selected = true;
            }
        };

        $scope.createAnnotation = function() {
            // get current playback time
            var startTime = Math.floor($scope.API.currentTime / 1000);
            var endTime = startTime + 5;

            var defaultAnnotation = {
                "start": startTime,
                "end": endTime,
                "position": {
                    "top": "50",
                    "left": "50"
                },
                "size": {
                    "height": "10",
                    "width": "20"
                },
                "is_inline": true,
                "text": '',
                "author": "Anonymous", //TODO - get author
                "video_id": $scope.config.source.id
            };
            $scope.selectAnnotation(defaultAnnotation, false);
        };

        $scope.selectAnnotation = function(annotation, seekTime) {
            if (seekTime === true) {
                $scope.API.seekTime(annotation.start);
            }
            $scope.selectedAnnotation = annotation;
            // add to inline annotations
            if (annotation.is_inline) {
                var i = $scope.inlineAnnotations.indexOf(annotation);
                if (i === -1) {
                    //TODO 
                    annotation.changeSize = function(size) {
                        annotation.size = size;
                    };
                    annotation.changePosition = function(position) {
                        annotation.position = position;
                    };
                    $scope.inlineAnnotations.push(annotation);
                }
            }
        };

        $scope.onPlayerReady = function(API) {
            $scope.API = API;
        };

        this.init = function() {
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

        socket.on('annotations:updated', function(annotations) {

            // clear current annotations state
            $scope.annotations = [];
            $scope.cuePoints.points = [];
            $scope.inlineAnnotations = [];
            $scope.selectedAnnotation = null;

            _.sortBy(annotations, 'start')
                .forEach(function(annotation) {
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
