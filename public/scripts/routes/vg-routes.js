app.config(["$routeProvider",
        function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/annotation-view.html',
                    controller: 'AnnotationCtrl',
                    controllerAs: "ctrl",
                    resolve: {
                        "annotations": ["$http",
                            function ($http) {
                                return $http.get('data/annotations.json');
                            }
                        ]
                    }
                });
        }]
);
