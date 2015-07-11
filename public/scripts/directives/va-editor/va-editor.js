app.directive('vaEditor', function () {
    return {
        scope: {
            source: '='
        },

        templateUrl: 'scripts/directives/va-editor/va-editor.html',
        controller: 'VaEditorController',
        controllerAs: 'vaEditorController'
    };
});
