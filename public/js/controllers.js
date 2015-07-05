app.controller('AnnotationsCtrl', function($scope, socket) {
    $scope.text = '';
    $scope.start_time = 0;
    
    $scope.createAnnotation = function() {
        console.log('creating');
        socket.emit('annotations:create', $scope.text);
    }
});