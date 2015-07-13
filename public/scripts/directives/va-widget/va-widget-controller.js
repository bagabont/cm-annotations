app.controller('VaWidgetController', ['$scope', 'socket', '$sce',
    function ($scope, socket, $sce) {
        var controller = this;

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
            var videoSource = $scope.config.source;

            controller.API = null;
            controller.sources = [{
                src: $sce.trustAsResourceUrl(videoSource.src),
                type: 'video/mp4'
            }];

            // IO request annotations
            var params = {video_id: videoSource.id};
            socket.emit('annotations:get', params);
        };

        controller.onLeave = function (currentTime, timeLapse, annotation) {
            annotation.completed = false;
            annotation.selected = false;
        };

        controller.onComplete = function (currentTime, timeLapse, annotation) {
            annotation.completed = true;
            annotation.selected = false;
            console.log('completed' + annotation)
        };

        controller.onUpdate = function (currentTime, timeLapse, annotation) {
            if (!annotation.selected) {
                annotation.completed = false;
                annotation.selected = true;
            }
        };

        socket.on('annotations:updated', function (annotations) {
            controller.selectedAnnotation = null;
            controller.annotations = []; // clear current state

            _.sortBy(annotations, 'start')
                .forEach(function (annotation) {
                    annotation.onLeave = controller.onLeave.bind(controller);
                    annotation.onUpdate = controller.onUpdate.bind(controller);
                    annotation.onComplete = controller.onComplete.bind(controller);
                    annotation.index = controller.annotations.length;

                    controller.annotations.push(annotation);
                });
        });

// Initialize controller
        controller.init();
    }
])
;
