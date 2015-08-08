app.directive('movable', function () {
    return {
        restrict: 'A',
        scope: {
            onMoved: '='
        },
        link: function (scope, element, attrs) {
            var getPosition = function (ui) {
                var position = {
                    left: Math.round((100 * ui.position.left / element.parent()[0].clientWidth)),
                    top: Math.round((100 * ui.position.top / element.parent()[0].clientHeight))
                };
                console.log(position);
                return position;
            };

            element.draggable({
                containment: 'parent',
                cursor: 'move',
                stop: function (event, ui) {
                    if (scope.onMoved) {
                        scope.onMoved({
                            position: getPosition(ui)
                        });
                    }
                }
            })
                .resizable({
                    containment: 'parent',
                    handles: 'ne, se, sw, nw',
                    stop: function (event, ui) {
                        if (scope.onMoved) {
                            scope.onMoved({
                                position: getPosition(ui),
                                size: ui.size
                            });
                        }
                    }
                });

            // remove event handlers
            scope.$on('$destroy', function () {
                element.off('**');
            });
        }
    };
});
