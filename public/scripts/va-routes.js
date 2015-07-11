app.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/va-view.html',
                controller: 'VideoAnnotationsController',
                controllerAs: "vaController",
                resolve: {
                    sources: ["$http", function ($http) {
                        return $http.get('data/sources.json');
                    }],
                    annotations: ["$http", function ($http) {
                        return $http.get('data/annotations.json');
                    }]
                }
            });
    }
]);
