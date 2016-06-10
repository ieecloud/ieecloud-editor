angular.module('ieecloud-editor.editor.viewer').controller('rulerExecutor', ['$scope', '$timeout',  function ($scope, $timeout) {
    $scope.execute = function () {
        $timeout(function(){
            $scope.addRuler();
        });

    }
}]);