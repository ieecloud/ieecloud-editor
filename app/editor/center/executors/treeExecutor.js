angular.module('ieecloud-editor.editor.viewer').controller('treeExecutor', ['$scope', '$log', function ($scope, $log) {
    $scope.execute = function () {
        $scope.showTree();
    };
}]);