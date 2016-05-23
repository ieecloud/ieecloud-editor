angular.module('ieecloud-editor.editor.viewer').controller('listObjectsExecutor', ['$scope',  '$log', '$mdToast', function ($scope,  $log, $mdToast) {
    $scope.execute = function () {
        var objectsNames = [];
        _.each($scope.selectedNodes, function(node){
            if(!node.parentName){
                objectsNames.push('"' + node.name + '"');
            }
        });

        $mdToast.show(
            $mdToast.simple()
                .textContent('removed objects: ' + _.toString(objectsNames))
                .position('top right')
                .hideDelay(2000)
        );

        $scope.consoleControl.setCmdParams({
            cmdType: $scope.cmdType,
            point: _.toString(objectsNames)
        });

    };
}]);

