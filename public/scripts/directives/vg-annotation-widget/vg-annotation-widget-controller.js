app.controller('vgAnnotationWidgetController', ['$scope',
    function ($scope) {

        var self = this;
        var timeLineEvents = [];

        function addTimeLinePoint(annotation) {
            var start = annotation.start;
            var end = annotation.end;

            var timeLineEvent = {};
            timeLineEvent.timeLapse = {
                start: start,
                end: end
            };

            timeLineEvent.onLeave = self.onLeave.bind(this);
            timeLineEvent.onUpdate = self.onUpdate.bind(this);
            timeLineEvent.onComplete = self.onComplete.bind(this);

            timeLineEvent.params = annotation;
            timeLineEvent.params.index = timeLineEvent.length;

            timeLineEvents.push(timeLineEvent);
        }

        $scope.addAnnotation = function (annotation) {
            //TODO-remove mock, load read annotation
            annotation = {
                "id": 5,
                "start": 3,
                "end": 8,
                "position": {
                    "top": "10%",
                    "left": "30%"
                },
                "size": {
                    "height": "10%",
                    "width": "20%"
                },
                "text": "To annotate, or not to annotate, that is the question: Whether 'tis Nobler in the mind to suffer",
                "author": {
                    "name": "William Shakespeare"
                }
            };
            addTimeLinePoint(annotation);
        };

        this.API = null;

        this.onPlayerReady = function onPlayerReady(API) {
            this.API = API;
        };

        this.init = function init() {
            for (var i = 0, l = $scope.vgConfig.annotations.length; i < l; i++) {
                addTimeLinePoint($scope.vgConfig.annotations[i]);
            }

            this.config = {
                sources: $scope.vgConfig.sources,
                cuePoints: {
                    annotations: timeLineEvents
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
