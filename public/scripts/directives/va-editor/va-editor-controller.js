app.controller('VaEditorController', ['$scope', 'socket',
    function($scope, socket) {
        $scope.saveAnnotation = function() {
            var annotation = $scope.annotation;
            var params = {
                annotation: annotation
            };
            socket.emit('annotations:save', params);
        };

        $scope.deleteAnnotation = function() {
            var params = {
                id: $scope.annotation._id
            };
            socket.emit('annotations:delete', params);
            $scope.annotation = null;
        };
    }
]);
