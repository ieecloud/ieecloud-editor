angular.module('ieecloud-editor.editor.viewer').controller('dialogDoubleExecutor', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {
        $scope.execute = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl'
            });

            modalInstance.result.then(function (doubleValue) {
                $scope.consoleControl.setCmdParams({
                    cmdType: $scope.cmdType,
                    point: doubleValue
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }])

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

        $scope.doubleValue = "";
        $scope.ok = function () {
            $modalInstance.close($scope.doubleValue);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });