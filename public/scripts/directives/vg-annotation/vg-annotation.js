app.directive('vgAnnotation',
    function() {
        return {
            scope: {
                vgDataProvider: '='
            },
            templateUrl: 'scripts/directives/vg-annotation/vg-annotation.html'
        };
    }
);
