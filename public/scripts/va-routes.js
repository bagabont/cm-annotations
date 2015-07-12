app.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/va-view.html',
                controller: 'VideoAnnotationsController',
                controllerAs: "vaController",
                resolve: {
                    source: ['$http', function ($http) {
                        return $http.get('data/sources.json');
                    }]
                }
            });
    }
]);
