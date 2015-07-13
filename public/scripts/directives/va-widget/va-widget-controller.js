app.controller('VaWidgetController', ['$scope', 'socket', '$sce',
    function ($scope, socket, $sce) {
        var controller = this;

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

        $scope.createAnnotation = function () {
            var defaultStartTime = Math.floor(controller.API.currentTime / 1000);
            var defaultEndTime = defaultStartTime + 5;

            var defaultAnnotation = {
                "start": defaultStartTime,
                "end": defaultEndTime,
                "position": {"top": "10%", "left": "30%"},
                "size": {"height": "10%", "width": "20%"},
                "text": '',
                "author": "Anonymous",
                "video_id": $scope.config.source.id
            };
            $scope.selectedAnnotation = defaultAnnotation;
        };

        $scope.selectAnnotation = function (annotation) {
            controller.API.seekTime(annotation.start);
            $scope.selectedAnnotation = annotation;
        };

        controller.onPlayerReady = function (API) {
            controller.API = API;
        };

        controller.init = function () {
            controller.cuePoints = {annotations: []};
            controller.annotations = [];
            controller.API = null;

            var videoSource = $scope.config.source;
            controller.sources = [{
                src: $sce.trustAsResourceUrl(videoSource.src),
                type: 'video/mp4'
            }];

            // IO request annotations
            var params = {video_id: videoSource.id};
            socket.emit('annotations:get', params);
        };

        socket.on('annotations:updated', function (annotations) {
            controller.selectedAnnotation = null;
            controller.annotations = []; // clear current state

            _.sortBy(annotations, 'start')
                .forEach(function (annotation) {

                    annotation.timeLapse = {
                        start: annotation.start,
                        end: annotation.end
                    };
                    annotation.params = annotation;

                    annotation.onLeave = onLeave;
                    annotation.onUpdate = onUpdate;
                    annotation.onComplete = onComplete;

                    controller.annotations.push(annotation);
                    controller.cuePoints.annotations.push(annotation);
                });
        });

        controller.init();
    }
]);