app.controller("vgAnnotationWidgetController", ["$scope",
    function ($scope) {
        this.API = null;

        this.onPlayerReady = function onPlayerReady(API) {
            this.API = API;
        };

        this.init = function init() {

            var timelinePoints = [];
            for (var i = 0, l = $scope.vgConfig.annotations.length; i < l; i++) {
                var annotation = $scope.vgConfig.annotations[i];

                var start = annotation.start;
                var end = annotation.end;

                var timelinePoint = {};
                timelinePoint.timeLapse = {
                    start: start,
                    end: end
                };

                timelinePoint.onLeave = this.onLeave.bind(this);
                timelinePoint.onUpdate = this.onUpdate.bind(this);
                timelinePoint.onComplete = this.onComplete.bind(this);

                timelinePoint.params = $scope.vgConfig.annotations[i];
                timelinePoint.params.index = i;

                timelinePoints.push(timelinePoint);
            }

            this.config = {
                sources: $scope.vgConfig.sources,
                cuePoints: {
                    annotations: timelinePoints
                }
            };
        };

        this.onLeave = function onLeave(currentTime, timeLapse, params) {
            params.completed = false;
            params.selected = false;
        };

        this.onComplete = function onComplete(currentTime, timeLapse, params) {
            params.completed = true;
            params.selected = false;
        };

        this.onUpdate = function onUpdate(currentTime, timeLapse, params) {
            if (!params.selected) {
                this.annotationElements[params.index].scrollIntoView();
                params.completed = false;
                params.selected = true;
            }
        };

        this.init();
    }]);
