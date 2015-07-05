app.directive("vgAnnotationWidget",
    function () {
        return {
            scope: {
                vgConfig: "="
            },
            templateUrl: "scripts/directives/vg-annotation-widget/vg-annotation-widget.html",
            controller: "vgAnnotationWidgetController",
            controllerAs: "ctrl",
            link: function link(scope, elem, attrs, ctrl) {
                ctrl.annotationElements = elem[0].getElementsByTagName("vg-annotation");
            }
        };
    }
);

