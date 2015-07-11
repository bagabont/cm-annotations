app.controller('VaWidgetController', ['$scope',
    function ($scope) {
        var controller = this;

        function addAnnotationEvent(annotation) {
            annotation.onLeave = controller.onLeave.bind(controller);
            annotation.onUpdate = controller.onUpdate.bind(controller);
            annotation.onComplete = controller.onComplete.bind(controller);
            annotation.index = controller.annotations.length;

            controller.annotations.push(annotation);
        }

        $scope.createAnnotation = function () {

            // get current player position and convert it from ms to sec
            var startTime = Math.floor(controller.API.currentTime / 1000);

            var annotation = {
                "start": startTime,
                "end": startTime + 5,
                "position": {
                    "top": "10%",
                    "left": "30%"
                },
                "size": {
                    "height": "10%",
                    "width": "20%"
                },
                "text": 'xa' // blank text
            };
            addAnnotationEvent(annotation);
            $scope.selectedAnnotation = annotation;
        };

        $scope.selectAnnotation = function (annotation) {
            controller.API.seekTime(annotation.start);
            $scope.selectedAnnotation = annotation;
        };

        controller.onPlayerReady = function (API) {
            controller.API = API;
        };

        controller.init = function () {
            controller.API = null;
            controller.annotations = [];
            controller.sources = $scope.config.sources;

            for (var i = 0, l = $scope.config.annotations.length; i < l; i++) {
                addAnnotationEvent($scope.config.annotations[i]);
            }

        };

        controller.onLeave = function (currentTime, timeLapse, annotation) {
            annotation.completed = false;
            annotation.selected = false;
        };

        controller.onComplete = function (currentTime, timeLapse, annotation) {
            annotation.completed = true;
            annotation.selected = false;
        };

        controller.onUpdate = function (currentTime, timeLapse, annotation) {
            if (!annotation.selected) {
                annotation.completed = false;
                annotation.selected = true;
            }
        };

        // Initialize controller
        controller.init();
    }
]);
