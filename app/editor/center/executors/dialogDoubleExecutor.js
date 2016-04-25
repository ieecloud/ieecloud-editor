angular.module('ieecloud-editor.editor.viewer').controller('dialogDoubleExecutor', ['$scope', '$uibModal', '$log', '$mdDialog', function ($scope, $uibModal, $log, $mdDialog) {
    $scope.execute = function () {
        var confirm = $mdDialog.prompt()
            .title('What would you dimension?')
            .placeholder('Enter')
            .ariaLabel('Double value')
            .ok('Ok')
            .cancel('Cancel')
            .openFrom('#cmd-list')
            .closeTo(angular.element(document.querySelector('#cmd-list')));
        $mdDialog.show(confirm).then(function(result) {
            $scope.consoleControl.setCmdParams({
                cmdType: $scope.cmdType,
                point: result
            });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
