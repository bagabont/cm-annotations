app.controller('VaEditorController', ['$scope', 'socket',
    function ($scope, socket) {
        $scope.saveAnnotation = function () {
            var annotation = $scope.source;

            alert(annotation.toString());

            socket.emit('annotations:create', annotation);
        }
    }
]);