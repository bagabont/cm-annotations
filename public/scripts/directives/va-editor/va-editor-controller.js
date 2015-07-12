app.controller('VaEditorController', ['$scope', 'socket',
    function ($scope, socket) {
        $scope.saveAnnotation = function () {
            if (!$scope.annotation) {
                return;
            }
            var params = {annotation: $scope.annotation};
            socket.emit('annotations:save', params);
        };

        $scope.deleteAnnotation = function () {
            if (!$scope.annotation) {
                return;
            }
            var params = {id: $scope.annotation._id};
            socket.emit('annotations:delete', params);
            $scope.annotation = null;
        };
    }
]);