angular.module('ieecloud-editor.editor.viewer').controller('treeExecutor', ['$scope', function ($scope) {
    $scope.execute = function () {
        $scope.showTree();
    };
}]);