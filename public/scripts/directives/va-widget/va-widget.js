app.directive('vaWidget',
    function() {
        return {
            scope: {
                config: '='
            },
            templateUrl: 'scripts/directives/va-widget/va-widget.html',
            controller: 'VaWidgetController',
            controllerAs: 'vaWidgetController'
        };
    }
);

app.directive('movable', function() {
    return {
        restrict: 'A',
        scope: {
            onResized: '=',
            onDragged: '='
        },
        link: function(scope, element, attrs) {

            // draggable
            if (attrs.draggable === 'true') {
                element.draggable({
                    containment: 'parent',
                    cursor: 'move',
                    stop: function(event, ui) {
                        if (scope.onDragged) {
                            var l = (100 * parseFloat($(this).css("left")) / parseFloat($(this).parent().css("width")));
                            var t = (100 * parseFloat($(this).css("top")) / parseFloat($(this).parent().css("height")));
                            scope.onDragged({
                                left: l,
                                top: t
                            });
                        }
                    }
                });
            }

            // resizable
            if (attrs.resizable === 'true') {
                element.resizable({
                    handles: 'ne, se, sw, nw',
                    stop: function(event, ui) {
                        if (scope.onResized) {
                            scope.onResized(ui.size);
                        }
                    }
                });
            }

            // remove event handlers
            scope.$on('$destroy', function() {
                element.off('**');
            });
        }
    };
});
