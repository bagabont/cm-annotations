app.directive('vaEditor', function () {
    return {
        scope: {
            annotation: '='
        },

        templateUrl: 'scripts/directives/va-editor/va-editor.html',
        controller: 'VaEditorController',
        controllerAs: 'vaEditorController'
    };
});
