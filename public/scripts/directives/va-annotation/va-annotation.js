app.directive('videoAnnotation', function () {
    return {
        scope: {
            source: '='
        },
        templateUrl: 'scripts/directives/va-annotation/va-annotation.html'
    };
});
