app.directive('vaWidget',
    function () {
        return {
            scope: {
                config: '='
            },
            templateUrl: 'scripts/directives/va-widget/va-widget.html',
            controller: 'VaWidgetController'
        };
    }
);
