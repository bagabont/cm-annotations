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

app.directive('resizable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (attrs.resizable !== 'true') {
                return;
            }
            element.resizable();
        }
    };
});

app.directive('draggable', function() {
    return {
        restrict: 'A',
        scope: {
            xpos: '=',
            ypos: '='
        },
        link: function(scope, element, attrs) {
            if (attrs.draggable !== 'true') {
                return;
            }
            element.draggable({
                containment: 'parent',
                cursor: 'move',
                stop: function(event, ui) {
                    scope.xpos = ui.position.left;
                    scope.ypos = ui.position.top;
                }
            });

            scope.$on('$destroy', function() {
                // remove event handlers
                element.off('**');
            });
        }
    };
});
