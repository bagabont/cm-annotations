app.directive('vaWidget',
    function () {
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

app.directive('draggable', function () {
    return {
        restrict: 'A',
        scope: {
            xpos: '=',
            ypos: '='
        },
        link: function (scope, element, attrs) {
            console.log(attrs.draggable)
            if (attrs.draggable !== 'true') {
                return;
            }

            console.log('making draggable')
            // convert element to draggable
            element.draggable({
                cursor: "move",
                stop: function (event, ui) {
                    scope.xpos = ui.position.left;
                    scope.ypos = ui.position.top;
                }
            });

            scope.$on('$destroy', function () {
                // remove event handlers
                element.off('**');
            });
        }
    };
});
