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
        restrict: 'EA',
        scope: {
            xpos: '=',
            ypos: '='
        },
        link: function (scope, element, attrs) {
            
            // convert element to draggable
            element.draggable({
                cursor: "move",
                stop: function (event, ui) {
                    scope[attrs.xpos] = ui.position.left;
                    scope[attrs.ypos] = ui.position.top;
                    scope.$apply();
                    console.log(scope[attrs.xpos]);
                }
            });
            
            scope.$on('$destroy', function () {
                // remove event handlers
                element.off('**');
            });
        }
    };
});
